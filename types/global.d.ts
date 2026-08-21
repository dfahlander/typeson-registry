// `QuotaExceededError` is not yet present in the bundled TS DOM lib.
declare global {
    interface QuotaExceededErrorOptions {
        quota?: number;
        requested?: number;
    }

    interface QuotaExceededError extends DOMException {
        readonly quota: number | null;
        readonly requested: number | null;
    }

    // eslint-disable-next-line no-var -- Ambient global declaration
    var QuotaExceededError: {
        prototype: QuotaExceededError;
        new (
            message?: string,
            options?: QuotaExceededErrorOptions
        ): QuotaExceededError;
    };
}

export {};
