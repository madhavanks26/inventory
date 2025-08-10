--For adding goods in goods table
-- -------------------------------
/*
set @output = '';
call addGoods('PP COVER','4x4','Food Packaging','KG','0','0','ACTIVE',@output);
select @output;
*/
DELIMITER //
	DROP PROCEDURE IF EXISTS addGoods;
	CREATE PROCEDURE addGoods (
        IN g_goodsName VARCHAR(255),
        IN g_goodsBrand VARCHAR(255),
        IN g_goodsSize VARCHAR(255),
        IN g_goodsDesc VARCHAR(255),
        IN g_goodsUnitOfMeasurement VARCHAR(255),
        IN g_availableStock VARCHAR(255),
        IN g_qtySold VARCHAR(255),
        IN g_goodsStatus VARCHAR(255),
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
    SELECT count(*) INTO record_count FROM goods WHERE goodsName=g_goodsName and goodsBrand=g_goodsBrand and goodsSize=g_goodsSize;
    IF record_count =0 THEN
        INSERT INTO goods (goodsId,goodsName,goodsBrand,goodsSize,goodsDesc,goodsUnitOfMeasurement,availableStock,qtySold,goodsStatus) VALUES
        (CONCAT('JEYAM_', UUID_SHORT()),g_goodsName,g_goodsBrand,g_goodsSize,g_goodsDesc,g_goodsUnitOfMeasurement,g_availableStock,g_qtySold,g_goodsStatus);
        COMMIT; -- only commit if insert is successful
        SET result_message = 'RECORD INSERTED';
    ELSE
        ROLLBACK; -- nothing to commit, but ensure rollback if needed
        SET result_message = 'RECORD EXISTS';
    END IF;

	END; //