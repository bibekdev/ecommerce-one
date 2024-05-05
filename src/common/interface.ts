export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
}

export interface SearchQuery {
  search?: string;
  price?: number;
  category?: string;
  sort?: string;
  page?: number;
}
