import type { Schema, Struct } from '@strapi/strapi';

export interface ProductSizeOption extends Struct.ComponentSchema {
  collectionName: 'components_product_size_options';
  info: {
    displayName: 'Size Option';
    icon: 'cup';
  };
  attributes: {
    size: Schema.Attribute.String;
  };
}

export interface SharedCallToAction extends Struct.ComponentSchema {
  collectionName: 'components_shared_call_to_actions';
  info: {
    displayName: 'Call-To-Action';
    icon: 'phone';
  };
  attributes: {
    body: Schema.Attribute.Text;
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.size-option': ProductSizeOption;
      'shared.call-to-action': SharedCallToAction;
    }
  }
}
