export interface SuggestionType {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    user: { 
        email: string;
    };
}