export interface ErrorResponse {
    success: false;
    message: string;
    errors?: Array<{
        field: string;
        errors: string[];
    }>;
    statusCode: number;
    timestamp?: string;
    path?: string;
    method?: string;
}