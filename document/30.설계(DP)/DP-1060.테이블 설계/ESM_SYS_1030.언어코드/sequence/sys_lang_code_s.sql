-- 시퀀스 테이블 삭제
drop sequence esm.sys_lang_code_s;

-- 시퀀스 테이블 생성
create sequence esm.sys_lang_code_s
minvalue 1
maxvalue 9999999999999
start with 1
increment by 1
cache 20
order;
