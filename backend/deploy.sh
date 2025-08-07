#!/bin/bash

#部署至Linux

WORKSPACE=$(dirname "$0")
TARGET_DIR="~"

echo "开始部署..."


echo "正在打包..."

export GOOS=linux
export GOARCH=amd64
go build -o vote-system main.go

echo "打包完成"


#上传至服务器
scp vote-system app@8.130.46.122:"$TARGET_DIR/"



if [ $? -eq 0 ]; then
    echo "上传成功，请重启nginx服务"
else
    echo "上传失败"
    echo "请检查网络连接和服务器配置"
    read -p "按 Enter 键继续..." dummy
fi

    exit 1






