@echo off
FOR /F "tokens=1* delims==" %%G IN ('findstr /v /r "^#.*" .env') DO (
    IF "%%H" NEQ "" (
        SET "%%G=%%H"
    )
)