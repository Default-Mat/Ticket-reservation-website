-- -----------------------------------------------------
-- Schema ticket_web
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table `city`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `city` (
  `city_id` INT NOT NULL AUTO_INCREMENT,
  `city_name` VARCHAR(45) NOT NULL,
  `available` TINYINT NOT NULL,
  PRIMARY KEY (`city_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `email` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `password` VARCHAR(120) NOT NULL,
  `phone_number` VARCHAR(45) NULL,
  `role` ENUM("admin", "user") NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `train_schedule`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `train_schedule` (
  `schedule_id` INT NOT NULL AUTO_INCREMENT,
  `departure_time` TIME NOT NULL,
  `arrival_time` TIME NOT NULL,
  `departure_date` DATE NOT NULL,
  `arrival_date` DATE NOT NULL,
  PRIMARY KEY (`schedule_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 10000;


-- -----------------------------------------------------
-- Table `train`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `train` (
  `train_id` INT NOT NULL AUTO_INCREMENT,
  `source_station` INT NOT NULL,
  `destination_station` INT NOT NULL,
  `train_name` VARCHAR(45) NOT NULL,
  `schedule_id` INT NOT NULL,
  `total_seats` INT NOT NULL,
  `train_type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`train_id`),
  INDEX `scheduel_fk_idx` (`schedule_id` ASC) VISIBLE,
  INDEX `stations_fk_idx` (`source_station` ASC) VISIBLE,
  INDEX `destination_station_fk_idx` (`destination_station` ASC) VISIBLE,
  CONSTRAINT `scheduel_fk`
    FOREIGN KEY (`schedule_id`)
    REFERENCES `train_schedule` (`schedule_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `source_stations_fk`
    FOREIGN KEY (`source_station`)
    REFERENCES `city` (`city_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `destination_station_fk`
    FOREIGN KEY (`destination_station`)
    REFERENCES `city` (`city_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 10000;


-- -----------------------------------------------------
-- Table `ticket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket` (
  `ticket_id` INT NOT NULL AUTO_INCREMENT,
  `train_id` INT NOT NULL,
  `wagon_number` INT NOT NULL,
  `available_tickets` INT NOT NULL,
  `price` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ticket_id`),
  UNIQUE INDEX `ticket_id_UNIQUE` (`ticket_id` ASC) VISIBLE,
  INDEX `train_id_fk_idx` (`train_id` ASC) VISIBLE,
  CONSTRAINT `train_id_fk`
    FOREIGN KEY (`train_id`)
    REFERENCES `train` (`train_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 10000;


-- -----------------------------------------------------
-- Table `purchased_ticket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `purchased_ticket` (
  `tracing_code` INT NOT NULL AUTO_INCREMENT,
  `ticket_id` INT NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `phone_number` VARCHAR(45) NULL,
  `id_number` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `birth_date` DATE NOT NULL,
  `sex` ENUM("مرد", "زن") NOT NULL,
  `service_type` VARCHAR(45) NULL,
  `status` ENUM("purchased", "cancelled", "pending payment") NOT NULL,
  PRIMARY KEY (`tracing_code`),
  INDEX `ticket_id_fk_idx` (`ticket_id` ASC) VISIBLE,
  INDEX `email_fk_idx` (`email` ASC) VISIBLE,
  CONSTRAINT `ticket_id_fk`
    FOREIGN KEY (`ticket_id`)
    REFERENCES `ticket` (`ticket_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `email_fk`
    FOREIGN KEY (`email`)
    REFERENCES `user` (`email`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 10000;


-- -----------------------------------------------------
-- Table `cancelation_list`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cancelation_list` (
  `cancellation_id` INT NOT NULL AUTO_INCREMENT,
  `tracing_code` INT NOT NULL,
  `cancelation_date` DATE NOT NULL,
  `refund_amount` VARCHAR(45) NOT NULL,
  `reason` VARCHAR(45) NULL,
  PRIMARY KEY (`cancellation_id`),
  INDEX `tracing_code_fk_idx` (`tracing_code` ASC) VISIBLE,
  CONSTRAINT `cancellation_fk`
    FOREIGN KEY (`tracing_code`)
    REFERENCES `purchased_ticket` (`tracing_code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 10000;


-- -----------------------------------------------------
-- Table `payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment` (
  `payment_id` INT NOT NULL AUTO_INCREMENT,
  `tracing_code` INT NOT NULL,
  `discount_percentage` INT NULL,
  `payment_amount` VARCHAR(45) NOT NULL,
  `payment_method` VARCHAR(45) NOT NULL,
  `status` ENUM("complete", "failed", "in progress") NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`payment_id`),
  INDEX `tracing_code_fk_idx` (`tracing_code` ASC) VISIBLE,
  CONSTRAINT `tracing_code_fk`
    FOREIGN KEY (`tracing_code`)
    REFERENCES `purchased_ticket` (`tracing_code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 10000;


-- -----------------------------------------------------
-- Table `admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin` (
  `email` VARCHAR(45) NOT NULL,
  `privilages` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`email`),
  CONSTRAINT `admin_fk`
    FOREIGN KEY (`email`)
    REFERENCES `user` (`email`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `vertification_code`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `vertification_code` (
  `email` VARCHAR(45) NOT NULL,
  `code` VARCHAR(45) NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`email`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `seat_allocation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `seat_allocation` (
  `seat_id` INT NOT NULL AUTO_INCREMENT,
  `ticket_id` INT NOT NULL,
  `tracing_code` INT NULL,
  `seat_number` INT NOT NULL,
  PRIMARY KEY (`seat_id`),
  INDEX `ticket_id_fk_idx` (`ticket_id` ASC) VISIBLE,
  INDEX `tracing_code_fk_idx` (`tracing_code` ASC) VISIBLE,
  CONSTRAINT `seat_ticket_id_fk`
    FOREIGN KEY (`ticket_id`)
    REFERENCES `ticket` (`ticket_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `seat_tracing_code_fk`
    FOREIGN KEY (`tracing_code`)
    REFERENCES `purchased_ticket` (`tracing_code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;