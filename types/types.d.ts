type LaravelResponseData = {
  success?: boolean;
  message: string;
  data?: any;
  error_code?: string;
  errors?: any;
  response_status?: number;
  response_ok?: boolean;
};

type LaravelResponseError = {
  success?: boolean;
  message: string;
  error_code?: string;
  errors?: any;
  response_status?: number;
  response_ok?: boolean;
};

type FabricTextboxProperty = {
  name?: string;
  width?: number;
  originX?: string;
  textAlign?: string;
  fontSize?: number;
  fill?: string;
  fontWeight?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  underline?: boolean;
  fontStyle?: "normal" | "italic";
  capitalize?: boolean;
  text?: string;
  fontFamily?: string;
  lineHeight?: number;
  //
  isShadow?: boolean;
};

declare namespace Model {
  type Category = {
    id: number;
    code: string;
    name: string;
    name_locale: string;
  };

  type Post = {
    id: number;
    ulid: string;
    wallet_id: number;
    title: string;
    content: string;
    type: string;
    source: string;
    total_likes: number;
    total_comments: number;
    total_views: number;
    locale: string;
    status: string;
    published_at: string;
    created_at: string;
    updated_at: string;
    deleted_at: null;
    status_label: string;
    type_label: string;
    wallet: Wallet;
    categories: Category[];
    allow_comment: boolean;
    file?: File;
  };

  type Page = {
    id: number;
    slug: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
  };

  type File = {
    id: number;
    ulid: string;
    mime: string;
    type: string;
    name: string;
    url: string;
    url_thumb?: string;
  };

  type Wallet = {
    id: number;
    ulid: string;
    address?: string;
    address_short: string;
    name?: string;
    email?: string;
    point_available?: number;
    created_at?: string;
    updated_at?: string;
  };

  type Comment = {
    id: number;
    ulid: string;
    content: string;
    total_likes: number;
    created_at: string;
    wallet?: Wallet;
    post?: Post;
  };

  type Paginator = {
    count: number;
    per_page: number;
    has_pages: boolean;
    has_more_pages: boolean;
    current_page: number;
    next_pageUrl: null | string;
    previous_page_url: null | string;
  };

  type Metadata = {
    short_title: string;
    title: string;
    description?: string;
    image?: string;
  };

  type Meme = {
    id: number;
    name: string;
    path: string;
    thumb: string;
    url_thumb: string;
    url: string;
    width: number;
    height: number;
    option?: MemeOption | null;
  };

  type MemeOption = {
    width?: number;
    textAlign?: string;
    fontSize?: number;
    fill?: string;
    fontWeight?: string;
    stroke?: string;
    strokeWidth?: number;
    underline?: boolean;
    fontStyle?: "normal" | "italic";
    capitalize?: boolean;
    fontFamily?: string;
    isShadow?: boolean;
  };
}

declare namespace Request {
  type FilterPost = {
    order: "new" | "hot" | "trending";
    title?: string;
    locale?: string;
    category?: string;
    source_type?: string;
    author?: string;
  };
}
