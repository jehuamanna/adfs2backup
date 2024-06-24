const ExpressError = require('../src/utils/expressError');

describe('Express Error utility', () => {
    it('should create a new Express Error class with the default error code', () => {
        const error = new ExpressError();

        expect(error.errorCode).toBe('DEFAULT_ERROR');
    });

    it('should use error code from the express error object if the function argument is an express error obj', () => {
        const parentError = new ExpressError('EXAMPLE_ERROR');

        const childError = new ExpressError(parentError);

        expect(childError.errorCode).toBe('EXAMPLE_ERROR');
    });

    it('should use custom error codes present in the erorrCodes file', () => {
        const error = new ExpressError('EXAMPLE_ERROR');

        expect(error.errorCode).toBe('EXAMPLE_ERROR');
    });

    it('should use default error if the error code is not present in the errorCodes file', () => {
        const error = new ExpressError('NON_EXISTENT_ERROR_CODE');

        expect(error.errorCode).toBe('DEFAULT_ERROR');
    });
});
