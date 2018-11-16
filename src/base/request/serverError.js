export default class ServerError extends Error{
  constructor(code, message){
    super();
    this.message= message;
    this.code = code;
  }
}
