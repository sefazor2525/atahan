@echo off
setlocal enabledelayedexpansion

:: Kullanıcıdan commit mesajı al
set /p commitMsg="Commit mesajını gir: "

:: Değişiklikleri sahneye ekle
git add .

:: Commit işlemi
git commit -m "%commitMsg%"
IF %ERRORLEVEL% NEQ 0 (
    echo Commit işlemi başarısız oldu.
    goto end
)

:: Aktif dalı kontrol et
FOR /F "tokens=*" %%i IN ('git rev-parse --abbrev-ref HEAD') DO SET currentBranch=%%i
echo Aktif dal: %currentBranch%

:: Push işlemi
git push origin %currentBranch%
IF %ERRORLEVEL% EQU 0 (
    echo Proje başarıyla GitHub'a gönderildi!
) ELSE (
    echo Hata: GitHub'a gönderme başarısız oldu.
)

:end
pause