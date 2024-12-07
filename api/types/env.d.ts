declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    SESSION_SECRET: string
    DATABASE_URL: string
    TEST_DATABASE_URL: string
    POSTGRES_PORT: string
    POSTGRES_USER: string
    POSTGRES_PASSWORD: string
    POSTGRES_DB: string
    POSTGRES_HOST: string
    SMTP_USER: string
    SMTP_HOST: string
    SMTP_PORT: string
    SMTP_PASS: string
    WEB_URI: string
    GITHUB_OAUTH_CLIENT_ID: string
    GITHUB_OAUTH_CLIENT_SECRET: string
    GITHUB_OAUTH_SCOPES: string
    GITHUB_OAUTH_REDIRECT_URI: string
    GOOGLE_OAUTH_CLIENT_ID: string
    GOOGLE_OAUTH_CLIENT_SECRET: string
    GOOGLE_OAUTH_SCOPES: string
    GOOGLE_OAUTH_REDIRECT_URI: string
    TWITCH_OAUTH_CLIENT_ID: string
    TWITCH_OAUTH_CLIENT_SECRET: string
    TWITCH_OAUTH_SCOPES: string
    TWITCH_OAUTH_REDIRECT_URI: string
    JWT_PRIVATE_KEY: string
    JWT_PUBLIC_KEY: string
    MEDIA_SERVER_SIGNATURE_HEADER: string
    MEDIA_SERVER_TRIGGER_HEADER: string
    MEDIA_SERVER_SECRET: string
    MEDIA_SERVER_HTTP_URL: string
    MEDIA_SERVER_API_URL: string
    MEDIA_SERVER_EVENT_URL: string
    REDIS_HOST: string
    REDIS_PORT: string
    REDIS_HOST_PASSWORD: string
  }
}
