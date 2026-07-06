export class SignUpRequest {
  constructor(
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public roles: string[]
  ) {
  }
}
