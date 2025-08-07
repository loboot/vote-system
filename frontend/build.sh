#!/bin/bash

TARGET_DIR="~"


echo "开始构建前端项目..."

pnpm run build

echo "正在压缩..."
if [ -d  "dist" ]; then
    tar -czf dist.tgz dist
    echo "压缩完成：dist.tgz"
  else 
    echo "dist 目录不存在"
fi

scp dist.tgz app@8.130.46.122:"$TARGET_DIR/"

if [ $? -eq 0 ];then
    echo "上传成功"
else
    echo "上传失败"
    echo "请检查网络连接和服务器配置"
    read -p "按 Enter 键继续..." dummy
fi

