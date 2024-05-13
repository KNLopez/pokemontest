export type PokemonLink = {
  name: string;
  url: string;
};

export type PaginationType = {
  count: number;
  next: string;
  previous: string;
  offset: number;
  limit: number;
};

export type PokemonDetailType = {
  name: string;
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
};
