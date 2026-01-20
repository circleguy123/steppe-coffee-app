/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AllergenGroupDto = {
  __typename?: 'AllergenGroupDto';
  /** Allergen's code */
  code?: Maybe<Scalars['String']['output']>;
  /** Allergen group ID */
  id: Scalars['ID']['output'];
  /** Allergen's name */
  name: Scalars['String']['output'];
};

export type CreateEventRsvpInput = {
  /** ID of the event to RSVP to */
  eventId: Scalars['String']['input'];
};

export type CreateUserInput = {
  /** In the dd.mm.yyyy format */
  birthday?: InputMaybe<Scalars['String']['input']>;
  /** Имя */
  name: Scalars['String']['input'];
  /** Номер телефона */
  phone: Scalars['String']['input'];
};

export type CreateUserOrderInput = {
  cardId?: InputMaybe<Scalars['String']['input']>;
  terminalId?: InputMaybe<Scalars['String']['input']>;
  userOrderItem?: InputMaybe<Array<InputMaybe<CreateUserOrderItemInput>>>;
};

export type CreateUserOrderItemInput = {
  amount: Scalars['Float']['input'];
  modifiers?: InputMaybe<Array<CreateUserOrderItemModifierInput>>;
  productId: Scalars['ID']['input'];
  productSizeId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateUserOrderItemModifierInput = {
  amount: Scalars['Float']['input'];
  productId: Scalars['ID']['input'];
};

export type EpayInvoiceOutput = {
  __typename?: 'EpayInvoiceOutput';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  membershipId?: Maybe<Scalars['String']['output']>;
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  status: EpayOrderStatus;
  type: EpayOrderType;
  userId: Scalars['String']['output'];
  userOrderId?: Maybe<Scalars['String']['output']>;
};

export enum EpayOrderStatus {
  Canceled = 'canceled',
  Failed = 'failed',
  New = 'new',
  Paid = 'paid',
  Pending = 'pending'
}

export enum EpayOrderType {
  Membership = 'Membership',
  SaveCard = 'SaveCard',
  UserOrder = 'UserOrder'
}

export type EpayUserCard = {
  __typename?: 'EpayUserCard';
  /** Masked card number */
  cardMask: Scalars['String']['output'];
  /** Card type (e.g., VISA, MASTERCARD) */
  cardType: Scalars['String']['output'];
  /** ID */
  id: Scalars['String']['output'];
  /** Card issuer bank */
  issuer: Scalars['String']['output'];
};

export type Event = {
  __typename?: 'Event';
  /** Description of the event. */
  description: Scalars['String']['output'];
  /** Date and time of the event. */
  eventDate: Scalars['DateTime']['output'];
  /** Length of the event in a readable format. */
  eventLength: Scalars['String']['output'];
  /** List of RSVPs for the event. */
  eventRsvp: Array<EventRsvp>;
  /** URL to the event website. */
  eventUrl?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the event. */
  id: Scalars['String']['output'];
  /** False if event is available. */
  isArchived: Scalars['Boolean']['output'];
  /** Location of the event. */
  location?: Maybe<Scalars['String']['output']>;
  /** URL to the event photo. */
  photoUrl?: Maybe<Scalars['String']['output']>;
  /** Price of the event ticket. */
  price: Scalars['Int']['output'];
  /** Number of tickets available for the event. */
  ticketsNumber: Scalars['Int']['output'];
  /** Title of the event. */
  title: Scalars['String']['output'];
};

export type EventOutput = {
  __typename?: 'EventOutput';
  /** Description of the event. */
  description: Scalars['String']['output'];
  /** Date and time of the event. */
  eventDate: Scalars['DateTime']['output'];
  /** Length of the event in a readable format. */
  eventLength: Scalars['String']['output'];
  /** URL to the event website. */
  eventUrl?: Maybe<Scalars['String']['output']>;
  /** True if user had already registered to the event */
  hasRegistered: Scalars['Boolean']['output'];
  /** Unique identifier for the event. */
  id: Scalars['String']['output'];
  /** False if event is available. */
  isArchived: Scalars['Boolean']['output'];
  /** Location of the event. */
  location?: Maybe<Scalars['String']['output']>;
  /** URL to the event photo. */
  photoUrl?: Maybe<Scalars['String']['output']>;
  /** Price of the event ticket. */
  price: Scalars['Int']['output'];
  /** Number of tickets left */
  ticketsLeft: Scalars['Int']['output'];
  /** Number of tickets available for the event. */
  ticketsNumber: Scalars['Int']['output'];
  /** Title of the event. */
  title: Scalars['String']['output'];
};

export type EventRsvp = {
  __typename?: 'EventRsvp';
  /** Event for which the RSVP is made. */
  event: Event;
  /** Event ID for which the RSVP is made. */
  eventId: Scalars['String']['output'];
  /** Unique identifier for the RSVP. */
  id: Scalars['String']['output'];
  /** Date and time when the RSVP was made. */
  reservedAt: Scalars['DateTime']['output'];
  /** User who made the RSVP. */
  user: User;
  /** User ID who made the RSVP. */
  userId: Scalars['String']['output'];
};

export type ExternalMenuPreset = {
  __typename?: 'ExternalMenuPreset';
  /** External menu description */
  description?: Maybe<Scalars['String']['output']>;
  /** ID of the external menu */
  id: Scalars['Int']['output'];
  /** Categories of items in the external menu */
  itemCategories: Array<TransportMenuCategoryDto>;
  /** External menu name */
  name: Scalars['String']['output'];
};

export type GetCustomerInfoResponse = {
  __typename?: 'GetCustomerInfoResponse';
  /** Guest anonymized. */
  anonymized: Scalars['Boolean']['output'];
  /** Guest birthday. */
  birthday?: Maybe<Scalars['String']['output']>;
  /** Customer cards. */
  cards: Array<GuestCardInfo>;
  /** Customer categories. */
  categories: Array<GuestCategoryShortInfo>;
  /** Guest comment. */
  comment?: Maybe<Scalars['String']['output']>;
  /** Consent status: 0 - unknown, 1 - given, 2 - revoked. */
  consentStatus: Scalars['Float']['output'];
  /** Guest culture name. */
  cultureName?: Maybe<Scalars['String']['output']>;
  /** Guest email. */
  email?: Maybe<Scalars['String']['output']>;
  /** Guest id. */
  id: Scalars['ID']['output'];
  /** Customer marked as deleted. */
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  /** Guest middle name. */
  middleName?: Maybe<Scalars['String']['output']>;
  /** Guest name. */
  name?: Maybe<Scalars['String']['output']>;
  /** Personal data consent from. */
  personalDataConsentFrom?: Maybe<Scalars['String']['output']>;
  /** Personal data consent to. */
  personalDataConsentTo?: Maybe<Scalars['String']['output']>;
  /** Personal data processing from. */
  personalDataProcessingFrom?: Maybe<Scalars['String']['output']>;
  /** Personal data processing to. */
  personalDataProcessingTo?: Maybe<Scalars['String']['output']>;
  /** Main customer phone. */
  phone?: Maybe<Scalars['String']['output']>;
  /** Guest referrer id. */
  referrerId?: Maybe<Scalars['ID']['output']>;
  /** Sex: 0 - not specified, 1 - male, 2 - female. */
  sex: Scalars['Float']['output'];
  /** Guest should receive loyalty info. */
  shouldReceiveLoyaltyInfo?: Maybe<Scalars['Boolean']['output']>;
  /** Guest should receive order status info. */
  shouldReceiveOrderStatusInfo?: Maybe<Scalars['Boolean']['output']>;
  /** Customer receives promo messages. */
  shouldReceivePromoActionsInfo?: Maybe<Scalars['Boolean']['output']>;
  /** Guest surname. */
  surname?: Maybe<Scalars['String']['output']>;
  /** Technical user data, customizable by restaurateur. */
  userData?: Maybe<Scalars['String']['output']>;
  /** Customer wallet balances. */
  walletBalances: Array<GuestBalanceInfo>;
};

export type GuestBalanceInfo = {
  __typename?: 'GuestBalanceInfo';
  /** Wallet balance. */
  balance: Scalars['Float']['output'];
  /** Wallet id. */
  id: Scalars['ID']['output'];
  /** Wallet name. */
  name: Scalars['String']['output'];
  /**
   * Wallet type.
   * 0 - deposit or corporate nutrition,
   * 1 - bonus program,
   * 2 - products program,
   * 3 - discount program,
   * 4 - certificate program.
   */
  type: Scalars['Float']['output'];
};

export type GuestCardInfo = {
  __typename?: 'GuestCardInfo';
  /** Card id. */
  id: Scalars['ID']['output'];
  /** Card number. */
  number: Scalars['String']['output'];
  /** Card track. */
  track: Scalars['String']['output'];
  /** Card valid to date. */
  validToDate?: Maybe<Scalars['String']['output']>;
};

export type GuestCategoryShortInfo = {
  __typename?: 'GuestCategoryShortInfo';
  /** Category id. */
  id: Scalars['ID']['output'];
  /** Is category active or not. */
  isActive: Scalars['Boolean']['output'];
  /** Is category default for new guests or not. */
  isDefaultForNewGuests: Scalars['Boolean']['output'];
  /** Category name. */
  name: Scalars['String']['output'];
};

/** Represents a user membership. */
export type Membership = {
  __typename?: 'Membership';
  /** Date and time membership was activated. */
  activatedAt: Scalars['DateTime']['output'];
  /** Card ID used to buy membership. */
  cardId: Scalars['String']['output'];
  /** Date and time membership was created. */
  createdAt: Scalars['DateTime']['output'];
  /** Date and time membership will expire. */
  expiresAt: Scalars['DateTime']['output'];
  /** Unique identifier for membership. */
  id: Scalars['String']['output'];
  /** Product ID for membership. */
  productId: Scalars['String']['output'];
  /** Membership status. */
  status: Scalars['String']['output'];
  /** Total cost of membership. */
  total: Scalars['Float']['output'];
  /** User ID associated with membership. */
  userId: Scalars['String']['output'];
};

export type ModifierRestrictionsDto = {
  __typename?: 'ModifierRestrictionsDto';
  /** Default amount */
  byDefault?: Maybe<Scalars['Int']['output']>;
  /** Amount free of charge */
  freeQuantity?: Maybe<Scalars['Int']['output']>;
  /** Maximum amount */
  maxQuantity?: Maybe<Scalars['Int']['output']>;
  /** Minimum amount */
  minQuantity?: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelInvoice: EpayInvoiceOutput;
  cancelMembership: Membership;
  createInvoice: EpayInvoiceOutput;
  createMembership: Membership;
  createRewardOrder: UserOrder;
  createUserOrder: UserOrder;
  deleteAccount: Scalars['Boolean']['output'];
  login: UserSessionOutput;
  removeCard: Array<EpayUserCard>;
  requestCode: Scalars['Boolean']['output'];
  retryUserOrderPayment: UserOrder;
  /** RSVP to an event */
  rsvpToEvent: EventOutput;
  signup: User;
  updateProfile: User;
};


export type MutationCancelInvoiceArgs = {
  id: Scalars['BigInt']['input'];
};


export type MutationCancelMembershipArgs = {
  membershipId: Scalars['String']['input'];
};


export type MutationCreateInvoiceArgs = {
  membershipId?: InputMaybe<Scalars['String']['input']>;
  type: EpayOrderType;
  userOrderId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateMembershipArgs = {
  cardId: Scalars['String']['input'];
  productId: Scalars['String']['input'];
};


export type MutationCreateRewardOrderArgs = {
  createUserOrderInput: CreateUserOrderInput;
};


export type MutationCreateUserOrderArgs = {
  createUserOrderInput: CreateUserOrderInput;
};


export type MutationLoginArgs = {
  code: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};


export type MutationRemoveCardArgs = {
  cardId: Scalars['String']['input'];
};


export type MutationRequestCodeArgs = {
  phone: Scalars['String']['input'];
};


export type MutationRetryUserOrderPaymentArgs = {
  retryUserOrderPaymentInput: RetryUserOrderPaymentInput;
};


export type MutationRsvpToEventArgs = {
  createEventRsvpInput: CreateEventRsvpInput;
};


export type MutationSignupArgs = {
  createUserInput: CreateUserInput;
};


export type MutationUpdateProfileArgs = {
  birthDate?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  surName?: InputMaybe<Scalars['String']['input']>;
};

export type NutritionInfoDto = {
  __typename?: 'NutritionInfoDto';
  /** Placeholder field for nutritional info */
  placeholder?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  epayInvoice: EpayInvoiceOutput;
  epayInvoices: Array<EpayInvoiceOutput>;
  /** Fetch all events with their RSVPs. */
  events: Array<EventOutput>;
  getCurrentMembership?: Maybe<Membership>;
  getUserCards: Array<EpayUserCard>;
  getUserOrder: UserOrderOutput;
  getUserOrders: Array<UserOrderOutput>;
  loyaltyUser: GetCustomerInfoResponse;
  membershipMenu: ExternalMenuPreset;
  profile: User;
  rewardMenu: ExternalMenuPreset;
  steppeMenu: ExternalMenuPreset;
};


export type QueryEpayInvoiceArgs = {
  id: Scalars['BigInt']['input'];
};


export type QueryGetUserOrderArgs = {
  id: Scalars['String']['input'];
};

export type RetryUserOrderPaymentInput = {
  cardId: Scalars['String']['input'];
  userOrderId: Scalars['String']['input'];
};

export type TagDto = {
  __typename?: 'TagDto';
  /** Tag ID */
  id: Scalars['String']['output'];
  /** Tag name */
  name: Scalars['String']['output'];
};

export type TaxCategoryDto = {
  __typename?: 'TaxCategoryDto';
  /** Tax category ID */
  id: Scalars['String']['output'];
  /** Tax category name */
  name: Scalars['String']['output'];
  /** Tax percentage */
  percentage?: Maybe<Scalars['Float']['output']>;
};

export type TransportItemDto = {
  __typename?: 'TransportItemDto';
  /** List of allergen groups */
  allergenGroups?: Maybe<Array<AllergenGroupDto>>;
  /** Product description */
  description?: Maybe<Scalars['String']['output']>;
  /** Product ID */
  itemId: Scalars['ID']['output'];
  /** List of item sizes */
  itemSizes: Array<TransportItemSizeDto>;
  /** Modifier schema ID */
  modifierSchemaId?: Maybe<Scalars['ID']['output']>;
  /** Product name */
  name?: Maybe<Scalars['String']['output']>;
  /** Product or compound. Depends on modifiers scheme existence */
  orderItemType: Scalars['String']['output'];
  /** Product code */
  sku?: Maybe<Scalars['String']['output']>;
  /** Tax category */
  taxCategory?: Maybe<TaxCategoryDto>;
};

export type TransportItemSizeDto = {
  __typename?: 'TransportItemSizeDto';
  /** Links to cropped button images */
  buttonImageCroppedUrl?: Maybe<Scalars['JSON']['output']>;
  /** Links to button image */
  buttonImageUrl?: Maybe<Scalars['String']['output']>;
  /** Whether it is the default size */
  isDefault: Scalars['Boolean']['output'];
  /** List of modifier groups for the item size */
  itemModifierGroups: Array<TransportModifierGroupDto>;
  /** Nutritional information per 100 grams */
  nutritionPerHundredGrams?: Maybe<NutritionInfoDto>;
  /** Size's weight */
  portionWeightGrams?: Maybe<Scalars['Float']['output']>;
  /** List of prices for the item size */
  prices: Array<TransportPriceDto>;
  /** Size code */
  sizeCode: Scalars['String']['output'];
  /** Size ID, can be empty if the default size is selected and it is the only size */
  sizeId?: Maybe<Scalars['ID']['output']>;
  /** Name of the product size */
  sizeName?: Maybe<Scalars['String']['output']>;
  /** Unique size code, consists of the product code and the name of the size */
  sku: Scalars['String']['output'];
};

export type TransportMenuCategoryDto = {
  __typename?: 'TransportMenuCategoryDto';
  /** Links to images */
  buttonImageUrl?: Maybe<Scalars['String']['output']>;
  /** Category description */
  description?: Maybe<Scalars['String']['output']>;
  /** Description header for the images */
  headerImageUrl?: Maybe<Scalars['String']['output']>;
  /** ID of the category of the external menu */
  id: Scalars['ID']['output'];
  /** List of items in the category */
  items: Array<TransportItemDto>;
  /** Category name of the external menu */
  name: Scalars['String']['output'];
};

export type TransportModifierGroupDto = {
  __typename?: 'TransportModifierGroupDto';
  /** Whether the modifier can be split */
  canBeDivided: Scalars['Boolean']['output'];
  /** Whether child modifiers can have their own restrictions, or only group ones */
  childModifiersHaveMinMaxRestrictions: Scalars['Boolean']['output'];
  /** Modifiers group description */
  description?: Maybe<Scalars['String']['output']>;
  /** Modifiers group ID */
  itemGroupId: Scalars['ID']['output'];
  /** List of modifier items */
  items: Array<TransportModifierItemDto>;
  /** Modifiers group name */
  name: Scalars['String']['output'];
  /** Restrictions applied to the modifier group */
  restrictions: ModifierRestrictionsDto;
  /** Modifiers group code */
  sku?: Maybe<Scalars['String']['output']>;
};

export type TransportModifierItemDto = {
  __typename?: 'TransportModifierItemDto';
  /** List of allergen groups */
  allergenGroups?: Maybe<Array<AllergenGroupDto>>;
  /** Links to images */
  buttonImage?: Maybe<Scalars['String']['output']>;
  /** Modifier's description */
  description?: Maybe<Scalars['String']['output']>;
  /** Modifier's ID */
  itemId: Scalars['ID']['output'];
  /** Modifier's name */
  name: Scalars['String']['output'];
  /** Nutritional information per 100 grams */
  nutritionPerHundredGrams?: Maybe<NutritionInfoDto>;
  /** Modifier's weight in grams */
  portionWeightGrams?: Maybe<Scalars['Float']['output']>;
  /** List of modifier prices */
  prices: Array<TransportPriceDto>;
  /** Restrictions applied to the modifier */
  restrictions?: Maybe<ModifierRestrictionsDto>;
  /** Modifier's code */
  sku?: Maybe<Scalars['String']['output']>;
  /** List of tags associated with the modifier */
  tags?: Maybe<Array<TagDto>>;
};

export type TransportPriceDto = {
  __typename?: 'TransportPriceDto';
  /** Organization ID */
  organizationId: Scalars['String']['output'];
  /** Product size prices for the organization. If the value is null, then the product/size is not for sale. The price always belongs to the price category selected at the time of the request. */
  price?: Maybe<Scalars['Float']['output']>;
};

export type User = {
  __typename?: 'User';
  /** Birth Date */
  birthDate?: Maybe<Scalars['DateTime']['output']>;
  /** List of RSVPs made by the user. */
  eventRsvps: Array<EventRsvp>;
  /** ID */
  id: Scalars['String']['output'];
  /** Name */
  name: Scalars['String']['output'];
  /** List of Epay user cards */
  paymentCards: Array<EpayUserCard>;
  /** Phone Number */
  phone: Scalars['String']['output'];
  /** Surname */
  surName?: Maybe<Scalars['String']['output']>;
};

/** Represents a user order. */
export type UserOrder = {
  __typename?: 'UserOrder';
  /** Date and time the order was created. */
  createdAt: Scalars['DateTime']['output'];
  /** Unique identifier for the order. */
  id: Scalars['String']['output'];
  /** Iiko Order Id */
  iikoOrderId?: Maybe<Scalars['String']['output']>;
  /** Iiko status of the order. */
  iikoStatus: Scalars['String']['output'];
  /** Menu ID associated with the order. */
  menuId: Scalars['String']['output'];
  /** Human readable order number */
  orderNumber: Scalars['Int']['output'];
  /** Organization ID associated with the order. */
  organizationId: Scalars['String']['output'];
  /** Payment status of the order. */
  paymentStatus: Scalars['String']['output'];
  /** Terminal group ID associated with the order. */
  terminalGroupId: Scalars['String']['output'];
  /** Total amount of the order. */
  total: Scalars['Float']['output'];
  type: UserOrderType;
  /** Date and time the order was updated. */
  updatedAt: Scalars['DateTime']['output'];
  /** User associated with the order. */
  user: User;
  /** User ID associated with the order. */
  userId: Scalars['String']['output'];
  /** List of items in the user order. */
  userOrderItem: Array<UserOrderItem>;
};

/** Represents an item in a user order. */
export type UserOrderItem = {
  __typename?: 'UserOrderItem';
  /** Quantity of the product in the order. */
  amount: Scalars['Float']['output'];
  /** Unique identifier for the order item. */
  id: Scalars['String']['output'];
  /** Price of the item. */
  price: Scalars['Float']['output'];
  /** Product ID associated with the item. */
  productId: Scalars['String']['output'];
  /** Product name associated with the item. */
  productName: Scalars['String']['output'];
  /** Product size ID associated with the item. */
  productSizeId?: Maybe<Scalars['String']['output']>;
  /** The user order this item is part of. */
  userOrder: UserOrder;
  /** User order ID to which this item belongs. */
  userOrderId: Scalars['String']['output'];
};

/** User Order Item */
export type UserOrderItemOutput = {
  __typename?: 'UserOrderItemOutput';
  /** Quantity of the product in the order. */
  amount: Scalars['Float']['output'];
  /** Unique identifier for the order item. */
  id: Scalars['String']['output'];
  /** Price of the item. */
  price: Scalars['Float']['output'];
  /** Product ID associated with the item. */
  productId: Scalars['String']['output'];
  /** Product name associated with the item. */
  productName: Scalars['String']['output'];
  /** Product size ID associated with the item. */
  productSizeId?: Maybe<Scalars['String']['output']>;
  /** User order ID to which this item belongs. */
  userOrderId: Scalars['String']['output'];
};

/** User Order */
export type UserOrderOutput = {
  __typename?: 'UserOrderOutput';
  /** Date and time the order was created. */
  createdAt: Scalars['DateTime']['output'];
  /** Unique identifier for the order. */
  id: Scalars['String']['output'];
  /** Iiko Order Id */
  iikoOrderId?: Maybe<Scalars['String']['output']>;
  /** Iiko status of the order. */
  iikoStatus: Scalars['String']['output'];
  /** Menu ID associated with the order. */
  menuId: Scalars['String']['output'];
  /** Human readable order number */
  orderNumber: Scalars['Int']['output'];
  /** Organization ID associated with the order. */
  organizationId: Scalars['String']['output'];
  /** Payment status of the order. */
  paymentStatus: Scalars['String']['output'];
  /** Terminal group ID associated with the order. */
  terminalGroupId: Scalars['String']['output'];
  /** Total amount of the order. */
  total: Scalars['Float']['output'];
  type: UserOrderType;
  /** Date and time the order was updated. */
  updatedAt: Scalars['DateTime']['output'];
  /** User ID associated with the order. */
  userId: Scalars['String']['output'];
  userOrderItem: Array<UserOrderItemOutput>;
};

/** Type of order that user had placed */
export enum UserOrderType {
  Delivery = 'Delivery',
  Reward = 'Reward',
  Takeaway = 'Takeaway'
}

export type UserSessionOutput = {
  __typename?: 'UserSessionOutput';
  /** JWT токен для доступа к API */
  accessToken: Scalars['String']['output'];
};

export type SignupMutationVariables = Exact<{
  phone: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'User', id: string, phone: string, name: string } };

export type LoginMutationVariables = Exact<{
  phone: Scalars['String']['input'];
  code: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserSessionOutput', accessToken: string } };

export type RequestCodeMutationVariables = Exact<{
  phone: Scalars['String']['input'];
}>;


export type RequestCodeMutation = { __typename?: 'Mutation', requestCode: boolean };

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: boolean };

export type EventsQueryVariables = Exact<{ [key: string]: never; }>;


export type EventsQuery = { __typename?: 'Query', events: Array<{ __typename?: 'EventOutput', id: string, title: string, description: string, eventDate: any, eventLength: string, ticketsNumber: number, photoUrl?: string | null, price: number, location?: string | null, hasRegistered: boolean, eventUrl?: string | null, isArchived: boolean, ticketsLeft: number }> };

export type RsvpToEventMutationVariables = Exact<{ [key: string]: never; }>;


export type RsvpToEventMutation = { __typename?: 'Mutation', rsvpToEvent: { __typename?: 'EventOutput', id: string, title: string, description: string, eventDate: any, eventLength: string, ticketsNumber: number, photoUrl?: string | null, price: number, location?: string | null, hasRegistered: boolean } };

export type LoyaltyUserQueryVariables = Exact<{ [key: string]: never; }>;


export type LoyaltyUserQuery = { __typename?: 'Query', loyaltyUser: { __typename?: 'GetCustomerInfoResponse', id: string, referrerId?: string | null, name?: string | null, surname?: string | null, middleName?: string | null, comment?: string | null, phone?: string | null, cultureName?: string | null, birthday?: string | null, email?: string | null, sex: number, consentStatus: number, anonymized: boolean, userData?: string | null, shouldReceivePromoActionsInfo?: boolean | null, shouldReceiveLoyaltyInfo?: boolean | null, shouldReceiveOrderStatusInfo?: boolean | null, personalDataConsentFrom?: string | null, personalDataConsentTo?: string | null, personalDataProcessingFrom?: string | null, personalDataProcessingTo?: string | null, isDeleted?: boolean | null, walletBalances: Array<{ __typename?: 'GuestBalanceInfo', id: string, name: string, type: number, balance: number }>, categories: Array<{ __typename?: 'GuestCategoryShortInfo', id: string, name: string, isActive: boolean, isDefaultForNewGuests: boolean }>, cards: Array<{ __typename?: 'GuestCardInfo', id: string, track: string, number: string, validToDate?: string | null }> }, getCurrentMembership?: { __typename?: 'Membership', id: string, activatedAt: any, expiresAt: any, status: string } | null };

export type RedeemRewardMutationVariables = Exact<{
  order: CreateUserOrderInput;
}>;


export type RedeemRewardMutation = { __typename?: 'Mutation', createRewardOrder: { __typename?: 'UserOrder', id: string, total: number, userId: string, iikoStatus: string, iikoOrderId?: string | null, paymentStatus: string, organizationId: string, terminalGroupId: string, menuId: string, userOrderItem: Array<{ __typename?: 'UserOrderItem', id: string, productId: string, amount: number, price: number, productSizeId?: string | null, userOrderId: string }> } };

export type CreateMembershipMutationVariables = Exact<{
  productId: Scalars['String']['input'];
  cardId: Scalars['String']['input'];
}>;


export type CreateMembershipMutation = { __typename?: 'Mutation', createMembership: { __typename?: 'Membership', id: string, expiresAt: any, status: string } };

export type GetCurrentMembershipQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentMembershipQuery = { __typename?: 'Query', getCurrentMembership?: { __typename?: 'Membership', id: string, activatedAt: any, expiresAt: any, status: string } | null };

export type CancelMembershipMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type CancelMembershipMutation = { __typename?: 'Mutation', cancelMembership: { __typename?: 'Membership', status: string } };

export type SteppeMenuQueryVariables = Exact<{ [key: string]: never; }>;


export type SteppeMenuQuery = { __typename?: 'Query', steppeMenu: { __typename?: 'ExternalMenuPreset', id: number, name: string, description?: string | null, itemCategories: Array<{ __typename?: 'TransportMenuCategoryDto', id: string, name: string, description?: string | null, buttonImageUrl?: string | null, headerImageUrl?: string | null, items: Array<{ __typename?: 'TransportItemDto', sku?: string | null, name?: string | null, description?: string | null, itemId: string, modifierSchemaId?: string | null, orderItemType: string, itemSizes: Array<{ __typename?: 'TransportItemSizeDto', sku: string, sizeCode: string, sizeName?: string | null, isDefault: boolean, portionWeightGrams?: number | null, sizeId?: string | null, buttonImageUrl?: string | null, buttonImageCroppedUrl?: any | null, prices: Array<{ __typename?: 'TransportPriceDto', organizationId: string, price?: number | null }>, itemModifierGroups: Array<{ __typename?: 'TransportModifierGroupDto', name: string, description?: string | null, canBeDivided: boolean, itemGroupId: string, childModifiersHaveMinMaxRestrictions: boolean, sku?: string | null, items: Array<{ __typename?: 'TransportModifierItemDto', sku?: string | null, name: string, description?: string | null, buttonImage?: string | null, portionWeightGrams?: number | null, itemId: string, prices: Array<{ __typename?: 'TransportPriceDto', organizationId: string, price?: number | null }>, restrictions?: { __typename?: 'ModifierRestrictionsDto', minQuantity?: number | null, maxQuantity?: number | null, freeQuantity?: number | null, byDefault?: number | null } | null, allergenGroups?: Array<{ __typename?: 'AllergenGroupDto', id: string, code?: string | null, name: string }> | null, nutritionPerHundredGrams?: { __typename?: 'NutritionInfoDto', placeholder?: string | null } | null }>, restrictions: { __typename?: 'ModifierRestrictionsDto', minQuantity?: number | null, maxQuantity?: number | null, freeQuantity?: number | null, byDefault?: number | null } }>, nutritionPerHundredGrams?: { __typename?: 'NutritionInfoDto', placeholder?: string | null } | null }>, allergenGroups?: Array<{ __typename?: 'AllergenGroupDto', id: string, code?: string | null, name: string }> | null, taxCategory?: { __typename?: 'TaxCategoryDto', id: string, name: string, percentage?: number | null } | null }> }> } };

export type RewardMenuQueryVariables = Exact<{ [key: string]: never; }>;


export type RewardMenuQuery = { __typename?: 'Query', rewardMenu: { __typename?: 'ExternalMenuPreset', id: number, name: string, description?: string | null, itemCategories: Array<{ __typename?: 'TransportMenuCategoryDto', id: string, name: string, description?: string | null, buttonImageUrl?: string | null, headerImageUrl?: string | null, items: Array<{ __typename?: 'TransportItemDto', sku?: string | null, name?: string | null, description?: string | null, itemId: string, modifierSchemaId?: string | null, orderItemType: string, itemSizes: Array<{ __typename?: 'TransportItemSizeDto', sku: string, sizeCode: string, sizeName?: string | null, isDefault: boolean, portionWeightGrams?: number | null, sizeId?: string | null, buttonImageUrl?: string | null, buttonImageCroppedUrl?: any | null, prices: Array<{ __typename?: 'TransportPriceDto', organizationId: string, price?: number | null }>, itemModifierGroups: Array<{ __typename?: 'TransportModifierGroupDto', name: string, description?: string | null, canBeDivided: boolean, itemGroupId: string, childModifiersHaveMinMaxRestrictions: boolean, sku?: string | null, items: Array<{ __typename?: 'TransportModifierItemDto', sku?: string | null, name: string, description?: string | null, buttonImage?: string | null, portionWeightGrams?: number | null, itemId: string, prices: Array<{ __typename?: 'TransportPriceDto', organizationId: string, price?: number | null }>, restrictions?: { __typename?: 'ModifierRestrictionsDto', minQuantity?: number | null, maxQuantity?: number | null, freeQuantity?: number | null, byDefault?: number | null } | null, allergenGroups?: Array<{ __typename?: 'AllergenGroupDto', id: string, code?: string | null, name: string }> | null, nutritionPerHundredGrams?: { __typename?: 'NutritionInfoDto', placeholder?: string | null } | null }>, restrictions: { __typename?: 'ModifierRestrictionsDto', minQuantity?: number | null, maxQuantity?: number | null, freeQuantity?: number | null, byDefault?: number | null } }>, nutritionPerHundredGrams?: { __typename?: 'NutritionInfoDto', placeholder?: string | null } | null }>, allergenGroups?: Array<{ __typename?: 'AllergenGroupDto', id: string, code?: string | null, name: string }> | null, taxCategory?: { __typename?: 'TaxCategoryDto', id: string, name: string, percentage?: number | null } | null }> }> } };

export type MembershipMenuQueryVariables = Exact<{ [key: string]: never; }>;


export type MembershipMenuQuery = { __typename?: 'Query', membershipMenu: { __typename?: 'ExternalMenuPreset', id: number, name: string, description?: string | null, itemCategories: Array<{ __typename?: 'TransportMenuCategoryDto', id: string, name: string, description?: string | null, buttonImageUrl?: string | null, headerImageUrl?: string | null, items: Array<{ __typename?: 'TransportItemDto', sku?: string | null, name?: string | null, description?: string | null, itemId: string, modifierSchemaId?: string | null, orderItemType: string, itemSizes: Array<{ __typename?: 'TransportItemSizeDto', sku: string, sizeCode: string, sizeName?: string | null, isDefault: boolean, portionWeightGrams?: number | null, sizeId?: string | null, buttonImageUrl?: string | null, buttonImageCroppedUrl?: any | null, prices: Array<{ __typename?: 'TransportPriceDto', organizationId: string, price?: number | null }>, itemModifierGroups: Array<{ __typename?: 'TransportModifierGroupDto', name: string, description?: string | null, canBeDivided: boolean, itemGroupId: string, childModifiersHaveMinMaxRestrictions: boolean, sku?: string | null, items: Array<{ __typename?: 'TransportModifierItemDto', sku?: string | null, name: string, description?: string | null, buttonImage?: string | null, portionWeightGrams?: number | null, itemId: string, prices: Array<{ __typename?: 'TransportPriceDto', organizationId: string, price?: number | null }>, restrictions?: { __typename?: 'ModifierRestrictionsDto', minQuantity?: number | null, maxQuantity?: number | null, freeQuantity?: number | null, byDefault?: number | null } | null, allergenGroups?: Array<{ __typename?: 'AllergenGroupDto', id: string, code?: string | null, name: string }> | null, nutritionPerHundredGrams?: { __typename?: 'NutritionInfoDto', placeholder?: string | null } | null }>, restrictions: { __typename?: 'ModifierRestrictionsDto', minQuantity?: number | null, maxQuantity?: number | null, freeQuantity?: number | null, byDefault?: number | null } }>, nutritionPerHundredGrams?: { __typename?: 'NutritionInfoDto', placeholder?: string | null } | null }>, allergenGroups?: Array<{ __typename?: 'AllergenGroupDto', id: string, code?: string | null, name: string }> | null, taxCategory?: { __typename?: 'TaxCategoryDto', id: string, name: string, percentage?: number | null } | null }> }> } };

export type CreateUserOrderMutationVariables = Exact<{
  order: CreateUserOrderInput;
}>;


export type CreateUserOrderMutation = { __typename?: 'Mutation', createUserOrder: { __typename?: 'UserOrder', id: string, orderNumber: number, total: number, userId: string, iikoStatus: string, iikoOrderId?: string | null, paymentStatus: string, organizationId: string, terminalGroupId: string, menuId: string, userOrderItem: Array<{ __typename?: 'UserOrderItem', id: string, productId: string, amount: number, price: number, productSizeId?: string | null, userOrderId: string }> } };

export type UpdateProfileMutationVariables = Exact<{
  name: Scalars['String']['input'];
  birthDate?: InputMaybe<Scalars['String']['input']>;
  surName?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'User', id: string, phone: string, name: string, surName?: string | null, birthDate?: any | null } };

export type CreateCardInvoiceMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateCardInvoiceMutation = { __typename?: 'Mutation', createInvoice: { __typename?: 'EpayInvoiceOutput', id: string } };

export type GetUserCardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserCardsQuery = { __typename?: 'Query', getUserCards: Array<{ __typename?: 'EpayUserCard', id: string, cardMask: string, cardType: string, issuer: string }> };

export type UserOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type UserOrdersQuery = { __typename?: 'Query', getUserOrders: Array<{ __typename?: 'UserOrderOutput', id: string, paymentStatus: string, iikoStatus: string, total: number, iikoOrderId?: string | null, orderNumber: number, createdAt: any }> };

export type UserOrderDetailsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type UserOrderDetailsQuery = { __typename?: 'Query', getUserOrder: { __typename?: 'UserOrderOutput', id: string, paymentStatus: string, iikoStatus: string, total: number, iikoOrderId?: string | null, orderNumber: number, createdAt: any, type: UserOrderType, userOrderItem: Array<{ __typename?: 'UserOrderItemOutput', id: string, productId: string, amount: number, price: number, productSizeId?: string | null, userOrderId: string, productName: string }> } };


export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createUserInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RequestCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}}]}]}}]} as unknown as DocumentNode<RequestCodeMutation, RequestCodeMutationVariables>;
export const DeleteAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAccount"}}]}}]} as unknown as DocumentNode<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const EventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eventDate"}},{"kind":"Field","name":{"kind":"Name","value":"eventLength"}},{"kind":"Field","name":{"kind":"Name","value":"ticketsNumber"}},{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"hasRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"eventUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"ticketsLeft"}}]}}]}}]} as unknown as DocumentNode<EventsQuery, EventsQueryVariables>;
export const RsvpToEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RsvpToEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rsvpToEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createEventRsvpInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eventId"},"value":{"kind":"StringValue","value":"fe418e9d-d9c6-4962-b462-842cd450cc8a","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eventDate"}},{"kind":"Field","name":{"kind":"Name","value":"eventLength"}},{"kind":"Field","name":{"kind":"Name","value":"ticketsNumber"}},{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"hasRegistered"}}]}}]}}]} as unknown as DocumentNode<RsvpToEventMutation, RsvpToEventMutationVariables>;
export const LoyaltyUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoyaltyUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loyaltyUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"referrerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}},{"kind":"Field","name":{"kind":"Name","value":"middleName"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"cultureName"}},{"kind":"Field","name":{"kind":"Name","value":"birthday"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"consentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"anonymized"}},{"kind":"Field","name":{"kind":"Name","value":"userData"}},{"kind":"Field","name":{"kind":"Name","value":"shouldReceivePromoActionsInfo"}},{"kind":"Field","name":{"kind":"Name","value":"shouldReceiveLoyaltyInfo"}},{"kind":"Field","name":{"kind":"Name","value":"shouldReceiveOrderStatusInfo"}},{"kind":"Field","name":{"kind":"Name","value":"personalDataConsentFrom"}},{"kind":"Field","name":{"kind":"Name","value":"personalDataConsentTo"}},{"kind":"Field","name":{"kind":"Name","value":"personalDataProcessingFrom"}},{"kind":"Field","name":{"kind":"Name","value":"personalDataProcessingTo"}},{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}},{"kind":"Field","name":{"kind":"Name","value":"walletBalances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isDefaultForNewGuests"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"track"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"validToDate"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getCurrentMembership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<LoyaltyUserQuery, LoyaltyUserQueryVariables>;
export const RedeemRewardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RedeemReward"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRewardOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createUserOrderInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"iikoStatus"}},{"kind":"Field","name":{"kind":"Name","value":"iikoOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"terminalGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"userOrderItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"productSizeId"}},{"kind":"Field","name":{"kind":"Name","value":"userOrderId"}}]}}]}}]}}]} as unknown as DocumentNode<RedeemRewardMutation, RedeemRewardMutationVariables>;
export const CreateMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateMembershipMutation, CreateMembershipMutationVariables>;
export const GetCurrentMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentMembership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentMembership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetCurrentMembershipQuery, GetCurrentMembershipQueryVariables>;
export const CancelMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"membershipId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CancelMembershipMutation, CancelMembershipMutationVariables>;
export const SteppeMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SteppeMenu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"steppeMenu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"itemCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"buttonImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"headerImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"itemId"}},{"kind":"Field","name":{"kind":"Name","value":"modifierSchemaId"}},{"kind":"Field","name":{"kind":"Name","value":"orderItemType"}},{"kind":"Field","name":{"kind":"Name","value":"itemSizes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"sizeCode"}},{"kind":"Field","name":{"kind":"Name","value":"sizeName"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"portionWeightGrams"}},{"kind":"Field","name":{"kind":"Name","value":"sizeId"}},{"kind":"Field","name":{"kind":"Name","value":"buttonImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"buttonImageCroppedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"itemModifierGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"canBeDivided"}},{"kind":"Field","name":{"kind":"Name","value":"itemGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"childModifiersHaveMinMaxRestrictions"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"buttonImage"}},{"kind":"Field","name":{"kind":"Name","value":"portionWeightGrams"}},{"kind":"Field","name":{"kind":"Name","value":"itemId"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"maxQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"freeQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"byDefault"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allergenGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutritionPerHundredGrams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeholder"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"maxQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"freeQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"byDefault"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutritionPerHundredGrams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeholder"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allergenGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SteppeMenuQuery, SteppeMenuQueryVariables>;
export const RewardMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RewardMenu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rewardMenu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"itemCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"buttonImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"headerImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"itemId"}},{"kind":"Field","name":{"kind":"Name","value":"modifierSchemaId"}},{"kind":"Field","name":{"kind":"Name","value":"orderItemType"}},{"kind":"Field","name":{"kind":"Name","value":"itemSizes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"sizeCode"}},{"kind":"Field","name":{"kind":"Name","value":"sizeName"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"portionWeightGrams"}},{"kind":"Field","name":{"kind":"Name","value":"sizeId"}},{"kind":"Field","name":{"kind":"Name","value":"buttonImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"buttonImageCroppedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"itemModifierGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"canBeDivided"}},{"kind":"Field","name":{"kind":"Name","value":"itemGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"childModifiersHaveMinMaxRestrictions"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"buttonImage"}},{"kind":"Field","name":{"kind":"Name","value":"portionWeightGrams"}},{"kind":"Field","name":{"kind":"Name","value":"itemId"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"maxQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"freeQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"byDefault"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allergenGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutritionPerHundredGrams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeholder"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"maxQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"freeQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"byDefault"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutritionPerHundredGrams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeholder"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allergenGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<RewardMenuQuery, RewardMenuQueryVariables>;
export const MembershipMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MembershipMenu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"membershipMenu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"itemCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"buttonImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"headerImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"itemId"}},{"kind":"Field","name":{"kind":"Name","value":"modifierSchemaId"}},{"kind":"Field","name":{"kind":"Name","value":"orderItemType"}},{"kind":"Field","name":{"kind":"Name","value":"itemSizes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"sizeCode"}},{"kind":"Field","name":{"kind":"Name","value":"sizeName"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"portionWeightGrams"}},{"kind":"Field","name":{"kind":"Name","value":"sizeId"}},{"kind":"Field","name":{"kind":"Name","value":"buttonImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"buttonImageCroppedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"itemModifierGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"canBeDivided"}},{"kind":"Field","name":{"kind":"Name","value":"itemGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"childModifiersHaveMinMaxRestrictions"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"buttonImage"}},{"kind":"Field","name":{"kind":"Name","value":"portionWeightGrams"}},{"kind":"Field","name":{"kind":"Name","value":"itemId"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"maxQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"freeQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"byDefault"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allergenGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutritionPerHundredGrams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeholder"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"restrictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"maxQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"freeQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"byDefault"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutritionPerHundredGrams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeholder"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allergenGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MembershipMenuQuery, MembershipMenuQueryVariables>;
export const CreateUserOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUserOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUserOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createUserOrderInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"iikoStatus"}},{"kind":"Field","name":{"kind":"Name","value":"iikoOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"terminalGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"userOrderItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"productSizeId"}},{"kind":"Field","name":{"kind":"Name","value":"userOrderId"}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserOrderMutation, CreateUserOrderMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"birthDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"surName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"birthDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"birthDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"surName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"surName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"surName"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const CreateCardInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCardInvoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInvoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"SaveCard"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateCardInvoiceMutation, CreateCardInvoiceMutationVariables>;
export const GetUserCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardMask"}},{"kind":"Field","name":{"kind":"Name","value":"cardType"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}}]}}]}}]} as unknown as DocumentNode<GetUserCardsQuery, GetUserCardsQueryVariables>;
export const UserOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"iikoStatus"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"iikoOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<UserOrdersQuery, UserOrdersQueryVariables>;
export const UserOrderDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserOrderDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"iikoStatus"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"iikoOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"userOrderItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"productSizeId"}},{"kind":"Field","name":{"kind":"Name","value":"userOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}}]}}]}}]}}]} as unknown as DocumentNode<UserOrderDetailsQuery, UserOrderDetailsQueryVariables>;