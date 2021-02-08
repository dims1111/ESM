-- 테이블스페이스 조회
select * from dba_data_files where file_name like '%esm%';

-- 테이블스페이스 생성
create tablespace esm datafile '/oradata01/VIS1226/esm.dbf' size 100m autoextend on maxsize unlimited;

-- 사용자 생성
create user esm identified by esm default tablespace esm temporary tablespace temp; 

-- 사용자 권한 생성
grant connect, resource, dba to esm with admin option;
