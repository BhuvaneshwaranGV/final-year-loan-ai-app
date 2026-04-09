h@echo off
setlocal
set MAVEN_PROJECTBASEDIR=%~dp0
if not "%MAVEN_PROJECTBASEDIR%"=="" set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

if "%JAVA_HOME%"=="" (
  echo JAVA_HOME is not set. Please set JAVA_HOME to your JDK installation.
  exit /b 1
)

set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

for /f "tokens=1,2 delims==" %%a in ('type "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"') do (
  if "%%a"=="wrapperUrl" set WRAPPER_URL=%%b
)

if not exist %WRAPPER_JAR% (
  echo Downloading Maven wrapper...
  powershell -NoProfile -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%WRAPPER_URL%', '%WRAPPER_JAR%') }"
)

"%JAVA_HOME%\bin\java.exe" -classpath %WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %*
exit /b %ERRORLEVEL%
