interface JwtTokenInterface {
  secret: string;
  lifetime: number;
}

export interface JwtAuthInterface {
  access: JwtTokenInterface;
  refresh: JwtTokenInterface;
}
