export class SignInResponse {
  constructor(public id: number, public email: string, public token: string, public roles: string[]) {
  }
}
