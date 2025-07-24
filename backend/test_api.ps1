# Vote System API 测试脚本 (PowerShell版本)
# 使用方法: .\test_api.ps1

$BaseUrl = "http://localhost:8080"

Write-Host "=== Vote System API 测试 ===" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor White
Write-Host ""

# 测试函数
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [string]$Data = $null
    )
    
    Write-Host "测试: $Name" -ForegroundColor Blue
    Write-Host "方法: $Method"
    Write-Host "端点: $Endpoint"
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    $uri = "$BaseUrl$Endpoint"
    
    try {
        if ($Data) {
            Write-Host "数据: $Data"
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body $Data
        } else {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers
        }
        
        Write-Host "响应:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 10 | Write-Host
        Write-Host "✓ 测试通过" -ForegroundColor Green
        
    } catch {
        Write-Host "响应:" -ForegroundColor Red
        Write-Host $_.Exception.Message
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host $responseBody
        }
        Write-Host "✗ 测试失败" -ForegroundColor Red
    }
    
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "1. 测试用户注册" -ForegroundColor Yellow
Test-Endpoint -Name "用户注册" -Method "POST" -Endpoint "/api/auth/register" -Data @"
{
  "username": "testuser123",
  "password": "123456",
  "confirmPassword": "123456"
}
"@

Write-Host "2. 测试用户登录" -ForegroundColor Yellow
Test-Endpoint -Name "用户登录" -Method "POST" -Endpoint "/api/auth/login" -Data @"
{
  "username": "testuser123",
  "password": "123456"
}
"@

Write-Host "3. 测试创建投票" -ForegroundColor Yellow
Test-Endpoint -Name "创建投票" -Method "POST" -Endpoint "/api/vote/create" -Data @"
{
  "title": "最喜欢的编程语言",
  "options": ["Go", "Python", "Java", "JavaScript"],
  "multi": false,
  "deadline": 1693478400
}
"@

Write-Host "4. 测试获取所有投票" -ForegroundColor Yellow
Test-Endpoint -Name "获取所有投票" -Method "GET" -Endpoint "/api/vote/all"

Write-Host "5. 测试获取投票详情" -ForegroundColor Yellow
Test-Endpoint -Name "获取投票详情" -Method "GET" -Endpoint "/api/vote/1"

Write-Host "6. 测试提交投票" -ForegroundColor Yellow
Test-Endpoint -Name "提交投票" -Method "POST" -Endpoint "/api/vote/submit" -Data @"
{
  "vote_id": 1,
  "option_ids": [1]
}
"@

Write-Host "7. 测试获取我创建的投票" -ForegroundColor Yellow
Test-Endpoint -Name "获取我创建的投票" -Method "GET" -Endpoint "/api/vote/my"

Write-Host "8. 测试更新投票" -ForegroundColor Yellow
Test-Endpoint -Name "更新投票" -Method "PUT" -Endpoint "/api/vote/update" -Data @"
{
  "id": 1,
  "title": "最喜欢的编程语言(更新版)",
  "options": ["Go", "Python", "Rust", "TypeScript"],
  "multi": true,
  "deadline": 1693478400
}
"@

Write-Host "=== API 测试完成 ===" -ForegroundColor Green
