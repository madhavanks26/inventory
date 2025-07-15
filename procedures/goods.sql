--For adding goods in goods table
-- -------------------------------

DELIMITER //
	DROP PROCEDURE IF EXISTS addGoods;
	CREATE PROCEDURE addGoods (
        IN goodsName VARCHAR(255),
        IN goodsSize VARCHAR(255),
        IN goodsDesc VARCHAR(255),
        IN goodsUnitOfMeasurement VARCHAR(255),
        IN availableStock VARCHAR(255),
        IN qtySold VARCHAR(255),
        IN goodsStatus VARCHAR(255),
        OUT result_message VARCHAR(255)) 
	BEGIN 
    DECLARE record_count INT;
    -- Error handler: rollback and return error message
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        -- Error handling block
        ROLLBACK;
        SET  result_message = 'Error occurred. Transaction rolled back.';
    END;
    START TRANSACTION;
	-- check for duplicate record
    SELECT count(*) INTO record_count FROM goods WHERE goodsName=goodsName and goodsSize=goodsSize;
    IF record_count =0 THEN
        INSERT INTO goods (goodsName,goodsSize,goodsDesc,goodsUnitOfMeasurement,availableStock,qtySold,goodsStatus) VALUES
        (goodsName,goodsSize,goodsDesc,goodsUnitOfMeasurement,availableStock,qtySold,goodsStatus);
        COMMIT; -- only commit if insert is successful
        SET result_message = 'RECORD INSERTED';
    ELSE
        ROLLBACK; -- nothing to commit, but ensure rollback if needed
        SET result_message = 'RECORD EXISTS';
    END IF;

	END; //