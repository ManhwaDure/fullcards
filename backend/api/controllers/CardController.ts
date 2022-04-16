import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Put,
  Query,
  Route,
  Security,
  SuccessResponse
} from "tsoa";
import ApiExposableError from "../ApiExposableError";
import apiResponseTransformer from "../CardApiResponseSafetyTransformer";
import {
  Card,
  CardBackground,
  CardContent,
  CardContentButton,
  CardTitle,
  CardWithDetails
} from "../CardTypes";
import { CardService } from "../services/CardService";

@Route("cards")
export class CardController extends Controller {
  private cardService: CardService;
  constructor() {
    super();
    this.cardService = new CardService();
  }
  /**
   * Gets card informations, which have only id and order.
   */
  @Get()
  public async getCards(): Promise<Card[]> {
    const cards = await this.cardService.getCards();

    return cards.map(i => apiResponseTransformer.transformCard(i));
  }

  /**
   * Gets fully detailed card information
   * @param id Card id
   */
  @Get("{id}")
  public async getCard(@Path() id: string): Promise<CardWithDetails> {
    const card = await this.cardService.getCard(id);

    return apiResponseTransformer.transformCardWithDetails(card);
  }

  /**
   * Deletes a card
   * @param id Card id
   */
  @Delete("{id}")
  @Security("jwt")
  public async deleteCard(@Path() id: string): Promise<void> {
    const result = await this.cardService.deleteCard(id);

    if (result) this.setStatus(200);
    else throw new ApiExposableError(404, "Card not found");
  }

  /**
   * Swaps order of two cards
   * @param firstId First card id
   * @param secondIf Second card id
   */
  @SuccessResponse(204, "No Content")
  @Security("jwt")
  @Post("{firstId}/swap_order_with/{secondId}")
  public async swapCardOrder(
    @Path() firstId: string,
    @Query() secondId: string
  ): Promise<void> {
    await this.cardService.swapCardOrder(firstId, secondId);
  }

  /**
   * Creates a card and returns card id and order. Card is created at the rear of the cards
   */
  @SuccessResponse("201", "Created")
  @Security("jwt")
  @Post()
  public async createCard(): Promise<Card> {
    const result = await this.cardService.createCard();

    this.setStatus(201);
    return result;
  }

  /**
   * Updates the card title
   * @param id Card id
   */
  @SuccessResponse(204, "No Content")
  @Security("jwt")
  @Patch("{id}/title")
  public async updateTitle(
    @Path() id: string,
    @Body() body: Partial<Omit<CardTitle, "id">>
  ): Promise<void> {
    const result = await this.cardService.updateTitle(id, body);

    if (result) return this.setStatus(204);
    else throw new ApiExposableError(404, "Card not found");
  }

  /**
   * Updates the card background
   * @param id Card id
   */
  @SuccessResponse(204, "No Content")
  @Security("jwt")
  @Patch("{id}/background")
  public async updateBackground(
    @Path() id: string,
    @Body()
    body: Partial<
      Omit<CardBackground, "image" | "id"> & { imageId: string | null }
    >
  ): Promise<void> {
    const result = await this.cardService.updateBackground(id, body);

    if (result) this.setStatus(204);
    else throw new ApiExposableError(404, "Card not found!");
  }

  /**
   * Updates the card content
   * @param id Card id
   */
  @SuccessResponse(204, "No Content")
  @Security("jwt")
  @Patch("{id}/content")
  public async updateContent(
    @Path() id: string,
    @Body()
    body: Partial<Omit<CardContent, "buttons">>
  ): Promise<void> {
    const result = await this.cardService.updateContent(id, body);

    if (result) this.setStatus(204);
    else throw new ApiExposableError(404, "Card not found!");
  }

  /**
   * Gets buttons in card content
   * @param id Card id
   */
  @Get("{id}/content/buttons")
  public async getButton(@Path() id: string): Promise<CardContentButton[]> {
    const buttons = await this.cardService.getButton(id);

    return buttons.map(apiResponseTransformer.transformCardContentButton);
  }

  /**
   * Creates a button in card content, new card will be on the rear of them.
   * @param id Card id
   */
  @Post("{id}/content/buttons")
  @Security("jwt")
  public async createButton(@Path() id: string): Promise<CardContentButton> {
    const button = await this.cardService.createButton(id);

    return apiResponseTransformer.transformCardContentButton(button);
  }

  /**
   * Updates a card content button
   * @param id Card id
   * @param buttonId Card content button id
   * @param body Card content changes
   */
  @Patch("{id}/content/buttons/{buttonId}")
  @SuccessResponse(204, "No Content")
  @Security("jwt")
  public async updateButton(
    @Path() id: string,
    @Path() buttonId: string,
    @Body() body: Partial<Omit<CardContentButton, "id" | "galleryImages">>
  ): Promise<void> {
    await this.cardService.updateButton(id, buttonId, body);

    this.setStatus(204);
  }

  /**
   * Swaps the card button order with another card button order
   * @param id Card id
   * @param buttonId Card content button id
   */
  @Patch(
    "{id}/content/buttons/{firstButtonId}/swap_order_with/{secondButtonId}"
  )
  @SuccessResponse(204, "No Content")
  @Security("jwt")
  public async swapButtonOrder(
    @Path() id: string,
    @Path() firstButtonId: string,
    @Path() secondButtonId: string
  ): Promise<void> {
    await this.cardService.swapButtonOrder(id, firstButtonId, secondButtonId);

    this.setStatus(204);
  }

  /**
   * Deletes a card content button
   * @param id Card id
   * @param buttonId Card content button id
   * @param body Card content changes
   */
  @Delete("{id}/content/buttons/{buttonId}")
  @SuccessResponse(204, "No Content")
  @Security("jwt")
  public async deleteButton(
    @Path() id: string,
    @Path() buttonId: string
  ): Promise<void> {
    await this.cardService.deleteButton(id, buttonId);

    this.setStatus(204);
  }

  /**
   * Updates gallery images of card content button, image orders are also automatically changed
   * @param id Card id
   * @param buttonId Card content button id
   * @param newImageIds: image ids
   */
  @Put("{id}/content/buttons/{buttonId}/images")
  @SuccessResponse(204, "No Content")
  @Security("jwt")
  public async updateButtonGalleryImages(
    @Path() id: string,
    @Path() buttonId: string,
    @Body() newImageIds: string[]
  ): Promise<void> {
    await this.cardService.updateButtonGalleryImages(id, buttonId, newImageIds);

    this.setStatus(204);
  }
}
