interface JwtTokenInterface {
  secret: string;
  /**
   * expressed in seconds or a string describing
   * a time span [zeit/ms](https://github.com/zeit/ms.js).
   * Eg: 60, "2 days", "10h", "7d"
   */
  lifetime: string | number;
}

export interface JwtAuthInterface {
  access: JwtTokenInterface;
  refresh: JwtTokenInterface;
}
