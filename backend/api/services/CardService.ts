import dataSource from "../../database/dataSource";
import * as models from "../../database/entities";
import ApiExposableError from "../ApiExposableError";
import {
  Card,
  CardBackground,
  CardContent,
  CardContentButton,
  CardTitle,
  CardWithDetails
} from "../CardTypes";

export class CardService {
  /**
   * Gets card informations, which have only id and order.
   */
  public async getCards(): Promise<Card[]> {
    const { manager } = dataSource;
    return await manager.find(models.Card, {
      select: ["id", "order"],
      order: {
        order: "ASC"
      }
    });
  }

  /**
   * Gets fully detailed card information
   * @param id Card id
   */
  public async getCard(id: string): Promise<CardWithDetails> {
    const manager = dataSource.manager;
    return await manager.findOneBy(models.Card, { id });
  }

  /**
   * Deletes a card, returns whether it's succeed.
   * @param id Card id
   */
  public async deleteCard(id: string): Promise<boolean> {
    const manager = dataSource.manager;
    const result = await manager.delete(models.Card, { id });
    return result.affected > 0;
  }

  /**
   * Swaps order of two cards
   * @param firstId First card id
   * @param secondIf Second card id
   */
  public async swapCardOrder(firstId: string, secondId: string): Promise<void> {
    const repository = dataSource.getRepository(models.Card);
    const cards = await repository.find({
      where: [{ id: firstId }, { id: secondId }],
      select: ["id", "order"]
    });

    if (cards.length === 0) {
      throw new ApiExposableError(404, "Cards not found!");
    } else if (cards.length === 1) {
      throw new ApiExposableError(
        404,
        `${cards[0].id === firstId ? "Second" : "First"} card not found!`
      );
    }

    await dataSource.manager.transaction(async manager => {
      const firstOrder = cards[0].order,
        secondOrder = cards[1].order,
        tempOrder =
          ((
            await manager
              .createQueryBuilder(models.Card, "card")
              .select("MAX(`order`)", "max")
              .getRawOne()
          ).max || 0) + 1;
      await manager.update(
        models.Card,
        {
          id: cards[0].id
        },
        {
          order: tempOrder
        }
      );
      await manager.update(
        models.Card,
        {
          id: cards[1].id
        },
        {
          order: firstOrder
        }
      );
      await manager.update(
        models.Card,
        {
          id: cards[0].id
        },
        {
          order: secondOrder
        }
      );
    });
  }

  /**
   * Creates a card and returns card id and order. Card is created at the rear of the cards
   */
  public async createCard(): Promise<Card> {
    const result = await dataSource.transaction(async manager => {
      const order =
        (((
          await manager
            .createQueryBuilder(models.Card, "card")
            .select("MAX(`order`)", "max")
            .getRawOne()
        ).max as number) || 0) + 1;
      let title = new models.CardTitle();
      title.content = "제목입니다";
      title.position = order === 1 ? "center" : "topRight";
      title = await manager.save(models.CardTitle, title);

      let content = new models.CardContent();
      content.content = "내용입니다.";
      content.withScrollDownText = false;
      content = await manager.save(models.CardContent, content);

      let background = new models.CardBackground();
      background.defaultGradient = true;
      background.pseudoParallaxScrollingAnimation = false;
      background = await manager.save(models.CardBackground, background);

      let card = new models.Card();
      card.title = title;
      card.content = content;
      card.background = background;
      card.order = order;
      card = await manager.save(models.Card, card);

      background.parent = card;
      content.parent = card;
      title.parent = card;
      await manager.save([background, content, title]);

      return {
        id: card.id,
        order: card.order
      };
    });
    return result;
  }

  /**
   * Updates the card title, returns whether it succeeds
   * @param id Card id
   */

  public async updateTitle(
    id: string,
    body: Partial<Omit<CardTitle, "id">>
  ): Promise<boolean> {
    const manager = dataSource.manager;
    const result = await manager.update(
      models.CardTitle,
      {
        parentId: id
      },
      body
    );

    return result.affected > 0;
  }

  /**
   * Updates the card background, return whether it success
   * @param id Card id
   */

  public async updateBackground(
    id: string,

    body: Partial<
      Omit<CardBackground, "image" | "id"> & { imageId: string | null }
    >
  ): Promise<boolean> {
    const result = await dataSource.getRepository(models.CardBackground).update(
      {
        parentId: id
      },
      body
    );

    return result.affected > 0;
  }

  /**
   * Updates the card content, returns whether it success
   * @param id Card id
   */

  public async updateContent(
    id: string,

    body: Partial<Omit<CardContent, "buttons">>
  ): Promise<boolean> {
    const result = await dataSource.getRepository(models.CardContent).update(
      {
        parentId: id
      },
      body
    );
    return result.affected > 0;
  }

  /**
   * Gets buttons in card content
   * @param id Card id
   */

  public async getButton(id: string): Promise<CardContentButton[]> {
    const { manager } = dataSource;
    const card = await manager.findOneBy(models.Card, {
      id
    });

    if (card === null) throw new ApiExposableError(404, "Card not found");

    return card.content.buttons.sort((a, b) => a.order - b.order);
  }

  /**
   * Creates a button in card content, new card will be on the rear of them.
   * @param id Card id
   */

  public async createButton(id: string): Promise<CardContentButton> {
    const { manager } = dataSource;
    const card = await manager.findOneBy(models.Card, {
      id
    });

    if (card === null) throw new ApiExposableError(404, "Card not found");

    let button = new models.CardContentButton();
    button.type = "anchor";
    button.content = "버튼";
    button.href = "https://www.example.com";
    button.parent = card.content;
    button.order =
      (((
        await manager
          .createQueryBuilder(models.CardContentButton, "card_content_button")
          .select("MAX(`order`)", "max")
          .where("parentId = :id", { id: card.content.id })
          .getRawOne()
      ).max as number) ?? 0) + 1;
    button = await manager.save(button);

    card.content.buttons.push(button);
    await manager.save(card.content);

    return button;
  }

  /**
   * Updates a card content button
   * @param id Card id
   * @param buttonId Card content button id
   * @param body Card content changes
   */

  public async updateButton(
    id: string,
    buttonId: string,
    body: Partial<Omit<CardContentButton, "id" | "galleryImages">>
  ): Promise<void> {
    const { manager } = dataSource;

    const card = await manager.findOne(models.Card, {
      where: { id },
      select: ["id", "content"]
    });

    if (card === null) throw new ApiExposableError(404, "Card not found");

    if (!card.content.buttons.some(i => i.id === buttonId))
      throw new ApiExposableError(404, "Button not found!");

    await manager.update(
      models.CardContentButton,
      {
        id: buttonId
      },
      body
    );
  }

  /**
   * Swaps the card button order with another card button order
   * @param id Card id
   * @param buttonId Card content button id
   */
  public async swapButtonOrder(
    id: string,
    firstButtonId: string,
    secondButtonId: string
  ): Promise<void> {
    const { manager } = dataSource;

    const card = await manager.findOne(models.Card, {
      where: { id },
      select: ["id", "content"]
    });

    if (card === null) throw new ApiExposableError(404, "Card not found");

    const buttons = card.content.buttons.filter(
      i => i.id === firstButtonId || i.id === secondButtonId
    );
    if (buttons.length === 0)
      throw new ApiExposableError(404, "Buttons not found");
    else if (buttons.length === 1)
      throw new ApiExposableError(
        404,
        `${
          buttons[0].id === firstButtonId ? "Second" : "First"
        } button not found`
      );

    await manager.transaction(async transactionManager => {
      const firstOrder = buttons[0].order,
        secondOrder = buttons[1].order,
        tempOrder =
          ((
            await transactionManager
              .createQueryBuilder(
                models.CardContentButton,
                "card_content_button"
              )
              .select("MAX(`order`)", "max")
              .where("parentId = :id", { id: card.content.id })
              .getRawOne()
          ).max ?? 0) + 1;
      await transactionManager.update(
        models.CardContentButton,
        {
          id: buttons[0].id
        },
        {
          order: tempOrder
        }
      );
      await transactionManager.update(
        models.CardContentButton,
        {
          id: buttons[1].id
        },
        {
          order: firstOrder
        }
      );

      await transactionManager.update(
        models.CardContentButton,
        {
          id: buttons[0].id
        },
        {
          order: secondOrder
        }
      );
    });
  }

  /**
   * Deletes a card content button
   * @param id Card id
   * @param buttonId Card content button id
   * @param body Card content changes
   */
  public async deleteButton(id: string, buttonId: string): Promise<void> {
    const { manager } = dataSource;

    const card = await manager.findOne(models.Card, {
      where: { id },
      select: ["id", "content"]
    });

    if (card === null) throw new ApiExposableError(404, "Card not found");

    if (!card.content.buttons.some(i => i.id === buttonId))
      throw new ApiExposableError(404, "Button not found!");

    await manager.delete(models.CardContentButton, {
      id: buttonId
    });
  }

  /**
   * Updates gallery images of card content button, image orders are also automatically changed
   * @param id Card id
   * @param buttonId Card content button id
   * @param newImageIds: image ids
   */

  public async updateButtonGalleryImages(
    id: string,
    buttonId: string,
    newImageIds: string[]
  ): Promise<void> {
    const { manager } = dataSource;

    const card = await manager.findOne(models.Card, {
      where: { id },
      select: ["id", "content"]
    });

    if (card === null) throw new ApiExposableError(404, "Card not found");

    if (!card.content.buttons.some(i => i.id === buttonId))
      throw new ApiExposableError(404, "Button not found");

    const button = card.content.buttons.filter(i => i.id === buttonId)[0];

    if (
      newImageIds.length > 0 &&
      (await manager.count(models.Image, {
        where: newImageIds.map(i => {
          return { id: i };
        })
      })) !== newImageIds.length
    )
      throw new ApiExposableError(404, "Some images not found");

    await manager.transaction(async transactionManager => {
      await transactionManager.delete(models.CardGalleryImage, {
        parentId: button.id
      });

      if (newImageIds.length === 0) return;
      const galleryImageEntities = newImageIds.map((i, idx) => {
        const entity = new models.CardGalleryImage();
        entity.imageId = i;
        entity.order = idx + 1;
        entity.parentId = button.id;

        return entity;
      });

      await transactionManager.save(galleryImageEntities);
    });
  }
}
