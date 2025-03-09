param(
    [switch]$watch,
    [switch]$compile
)

# SCSS构建脚本

# 设置变量
$scssDir = "app\static\css\scss"
$cssOutput = "app\static\css\styles.css"

# 检查是否安装了sass
try {
    $sassVersion = sass --version
    Write-Host "检测到 Sass 版本: $sassVersion"
} catch {
    Write-Host "错误: 未安装 sass 或无法执行 sass 命令" -ForegroundColor Red
    Write-Host "请先安装 sass: gem install sass" -ForegroundColor Yellow
    exit 1
}

# 编译函数
function Compile-Scss {
    Write-Host "正在编译 SCSS..." -ForegroundColor Cyan
    try {
        sass "$scssDir\main.scss" $cssOutput --style=compressed
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ SCSS编译成功！" -ForegroundColor Green
            Write-Host "输出文件：$cssOutput" -ForegroundColor Gray
        } else {
            Write-Host "× SCSS编译失败！" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "× SCSS编译过程中发生错误：$_" -ForegroundColor Red
        exit 1
    }
}

# 监视函数
function Watch-Scss {
    Write-Host "开始监视 SCSS 文件变化..." -ForegroundColor Cyan
    Write-Host "监视目录: $scssDir" -ForegroundColor Gray
    Write-Host "输出文件: $cssOutput" -ForegroundColor Gray
    Write-Host "按 Ctrl+C 停止监视" -ForegroundColor Yellow
    
    try {
        sass --watch "$scssDir\main.scss":"$cssOutput" --style=compressed
    } catch {
        Write-Host "× 监视过程中发生错误：$_" -ForegroundColor Red
        exit 1
    }
}

# 主逻辑
if ($watch) {
    Watch-Scss
} elseif ($compile) {
    Compile-Scss
} else {
    Write-Host "用法：" -ForegroundColor Cyan
    Write-Host "编译SCSS：.\scss.ps1 -compile" -ForegroundColor Gray
    Write-Host "监视SCSS：.\scss.ps1 -watch" -ForegroundColor Gray
}