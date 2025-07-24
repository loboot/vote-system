#!/bin/bash

# Vote System API 测试脚本
# 使用方法: ./test_api.sh

BASE_URL="http://localhost:8080"

echo "=== Vote System API 测试 ==="
echo "Base URL: $BASE_URL"
echo

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 测试函数
test_endpoint() {
  local name="$1"
  local method="$2"
  local endpoint="$3"
  local data="$4"
  
  echo -e "${BLUE}测试: $name${NC}"
  echo "方法: $method"
  echo "端点: $endpoint"
  
  if [ -n "$data" ]; then
    echo "数据: $data"
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      -d "$data" \
      "$BASE_URL$endpoint")
  else
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X "$method" "$BASE_URL$endpoint")
  fi
  
  # 提取HTTP状态码
  http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
  # 提取响应体
  body=$(echo "$response" | sed '/HTTP_CODE:/d')
  
  echo "响应码: $http_code"
  echo "响应体:"
  echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
  
  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo -e "${GREEN}✓ 测试通过${NC}"
  else
    echo -e "${RED}✗ 测试失败${NC}"
  fi
  
  echo "----------------------------------------"
  echo
}

echo -e "${YELLOW}1. 测试用户注册${NC}"
test_endpoint "用户注册" "POST" "/api/auth/register" '{
  "username": "testuser123",
  "password": "123456",
  "confirmPassword": "123456"
}'

echo -e "${YELLOW}2. 测试用户登录${NC}"
test_endpoint "用户登录" "POST" "/api/auth/login" '{
  "username": "testuser123",
  "password": "123456"
}'

echo -e "${YELLOW}3. 测试创建投票${NC}"
test_endpoint "创建投票" "POST" "/api/vote/create" '{
  "title": "最喜欢的编程语言",
  "options": ["Go", "Python", "Java", "JavaScript"],
  "multi": false,
  "deadline": 1693478400
}'

echo -e "${YELLOW}4. 测试获取所有投票${NC}"
test_endpoint "获取所有投票" "GET" "/api/vote/all"

echo -e "${YELLOW}5. 测试获取投票详情${NC}"
test_endpoint "获取投票详情" "GET" "/api/vote/1"

echo -e "${YELLOW}6. 测试提交投票${NC}"
test_endpoint "提交投票" "POST" "/api/vote/submit" '{
  "vote_id": 1,
  "option_ids": [1]
}'

echo -e "${YELLOW}7. 测试获取我创建的投票${NC}"
test_endpoint "获取我创建的投票" "GET" "/api/vote/my"

echo -e "${YELLOW}8. 测试更新投票${NC}"
test_endpoint "更新投票" "PUT" "/api/vote/update" '{
  "id": 1,
  "title": "最喜欢的编程语言(更新版)",
  "options": ["Go", "Python", "Rust", "TypeScript"],
  "multi": true,
  "deadline": 1693478400
}'

echo -e "${GREEN}=== API 测试完成 ===${NC}"
