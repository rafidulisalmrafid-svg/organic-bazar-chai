FROM php:8.3-apache
# Install system dependencies & PHP extensions
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
        libpng-dev \
            libjpeg-dev \
                libfreetype6-dev \
                    libzip-dev \
                        zip \
                            unzip \
                                curl \
                                    git \
                                        && docker-php-ext-configure gd --with-freetype --with-jpeg \
                                            && docker-php-ext-install -j$(nproc) gd pdo pdo_sqlite zip bcmath opcache \
                                                && apt-get clean && rm -rf /var/lib/apt/lists/*

                                                # Configure Apache DocumentRoot to public
                                                ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
                                                RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
                                                RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
                                                RUN a2enmod rewrite

                                                # Install Composer
                                                COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

                                                # Set working directory
                                                WORKDIR /var/www/html

                                                # Copy application files (including pre-built assets in public/build)
                                                COPY . .

                                                # Install PHP dependencies
                                                RUN composer install --no-dev --optimize-autoloader --no-interaction
