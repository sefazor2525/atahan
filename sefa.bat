@echo off
setlocal enabledelayedexpansion

:: Git projesi içinde miyiz?
git rev-parse --is-inside-work-tree >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo HATA: Bu klasör bir Git projesi değil. Lütfen 'git init' komutunu çalıştır veya doğru klasöre geç.
    goto end
)

:: Commit mesajını al
set /p commitMsg="Commit mesajını gir: "

:: Değişiklikleri sahneye ekle
git add .

:: Commit işlemi
git commit -m "%commitMsg%"
IF %ERRORLEVEL% NEQ 0 (
    echo Commit işlemi başarısız oldu.
    goto end
)

:: Aktif dalı al
FOR /F "tokens=*" %%i IN ('git rev-parse --abbrev-ref HEAD') DO SET currentBranch=%%i
echo Aktif dal: %currentBranch%

:: Push işlemi
git push origin %currentBranch%
IF %ERRORLEVEL% EQU 0 (
    echo Proje başarıyla GitHub'a gönderildi!
) ELSE (
    echo HATA: GitHub'a gönderme başarısız oldu.
)

:end
pause