class customException {
  protected message: string;
  protected code: string;
  protected data: boolean;
  constructor(message: string, code = "-99", data = false) {
    this.message = message;
    this.code = code;
    this.data = data;
  }
}
export default customException;
