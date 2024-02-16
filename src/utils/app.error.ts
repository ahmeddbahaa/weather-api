import { HttpStatus } from "@nestjs/common"

export class AppError extends Error {
  readonly statusCode: HttpStatus
  readonly error: ErrorType
  constructor(message: string, statusCode: HttpStatus, error: ErrorType) {
    super(message)
    this.statusCode = statusCode
    this.error = error
    Error.captureStackTrace(this)
  }
}
export enum ErrorType {
  INVALID_INPUT = 'InvalidInputError',
  MODEL_ERROR = 'ModelValidationError',
  INTERNAL_ERROR = 'InternalError',
}
