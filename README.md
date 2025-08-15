# inventory
#NOV0722
--------
-download mysql community server 8.0.31 from https://dev.mysql.com/downloads/
-install mysql community server
-navigate to mysql bin location cd /usr/local/mysql/bin
-execute mysql -u root -p with password
-start the mysql command
-create database inventory
#JUN3024
--------
#error:
code: 'ER_NOT_SUPPORTED_AUTH_MODE',
  errno: 1251,
  sqlMessage: 'Client does not support authentication protocol requested by server; consider upgrading MySQL client',
  sqlState: '08004',
  fatal: true
#solution:
connect to sql via terminal as mentioned above
change the root password by the below query
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_current_password';
#reference link
https://stackoverflow.com/questions/51147964/errno-1251-sqlmessage-client-does-not-support-authentication-protocol-reques

#01SEP2024
--------
Adding mysql bin path to $PATH variable:

https://stackoverflow.com/questions/10577374/mysql-command-not-found-in-os-x-10-7
error: 
  zsh: command not found: mysql
added mysql bin path to $PATH
command:
export PATH=${PATH}:/usr/local/mysql/bin

#26DEC2024
----------
start the mysql server from settings -> MySQL
connect to mysql:
navigate to cd /usr/local/mysql/bin
./mysql -u root -p
enter password from .env file

#11JUL25
---------
Goods module added new procedure for handling add goods with handling duplicate insert

#15JUL25
--------
addGoods Procedure created newly

#10AUG25
--------
goodsBrand column introduced
unique scenario consideration before:
12x12 PP COVER
issue : same size pp cover can be two or more other brands as well
hence combination of goodsSize , goodsName , goodsBrand cosnidered as unique record for goods
12x12 PP COVER THANGARATHAM
12x12 PP COVER MARUTHI

#13AUG25
--------
updated package.json to "type":"module",
changed all syntax from require to import

#15AUG25
---------
allowing space in goodsSize creating duplicate issue
scenario: 12 x 12 and 12x12 are considered as two different goods
Hence Space removed and validation is performed accordingly