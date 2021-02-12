import { CardSectionJsonData } from "./CardSectionJsonData";

export enum CardPageDataType {
  Firebase,
  Json,
}
type transformCardPageDataFunction = ((
  data: CardSectionJsonData[],
  fromType: CardPageDataType.Json,
  toType: CardPageDataType.Firebase
) => any) &
  ((
    data: any,
    fromType: CardPageDataType.Firebase,
    toType: CardPageDataType.Json
  ) => CardSectionJsonData[]);
const transformCardPageData: transformCardPageDataFunction = (
  data,
  fromType: CardPageDataType,
  toType: CardPageDataType
) => {
  if (fromType === toType) return data;
  // Deep clone data
  data = JSON.parse(JSON.stringify(data));

  // Convert data into interal data type if needed
  if (fromType === CardPageDataType.Firebase) {
    if (data === null) data = [];
    else
      data = Object.entries(data)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([_i, v]) => v)
        .map((i) => {
          const transformed = i as any;
          if (transformed?.content?.buttons)
            transformed.content.buttons = Object.entries(
              transformed.content.buttons
            )
              .sort((a, b) => Number(a[0]) - Number(b[0]))
              .map(([_i, v]) => {
                const vv = v as any;
                if (!vv.galleryImages) vv.galleryImages = [];
                return vv;
              });
          else transformed.content.buttons = [];
          if (!transformed.background.image)
            transformed.background.image = null;
          if (!transformed.background.style) transformed.background.style = {};
          return transformed;
        });
  }
  // Convert data into firebase type if needed
  if (toType === CardPageDataType.Firebase) {
    data = (data as Array<any>).reduce((result, now, index) => {
      now.content.buttons = now.content.buttons.reduce((result, now, index) => {
        result[index] = now;
        return result;
      }, {});
      result[index] = now;
      return result;
    }, {});
  }
  return data;
};

export default transformCardPageData;
