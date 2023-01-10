FROM drupal:9.5.1-php8.0-apache

ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache

RUN apt-get update && apt-get install -y \
		curl \
		git \
		nano \
		wget \
		unzip \
		default-mysql-client

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
		php composer-setup.php && \
		mv composer.phar /usr/local/bin/composer && \
		php -r "unlink('composer-setup.php');"

RUN wget -O drush.phar https://github.com/drush-ops/drush-launcher/releases/download/0.4.2/drush.phar && \
		chmod +x drush.phar && \
		mv drush.phar /usr/local/bin/drush

RUN rm -rf /var/www/html/*
RUN cd .. && \
		rm -r drupal && \
		git clone https://github.com/vinugawade/agns-web.git drupal && \
		cd drupal && \
		composer install

COPY ./apache-drupal.conf /etc/apache2/sites-enabled/000-default.conf
COPY ./web/sites/default/settings.local.php /opt/drupal/web/sites/default/settings.local.php

RUN chmod 0644 /opt/drupal/web/sites/default/settings.php && \
		chmod 0644 /opt/drupal/web/sites/default/settings.local.php && \
		mkdir /opt/drupal/web/sites/default/files && \
		mkdir /opt/drupal/web/sites/default/files/private && \
		chmod -R 777 /opt/drupal/web/sites/default/files
		# && \
		# chmod 777 /opt/drupal/web/sites/default/files/private

WORKDIR /opt/drupal