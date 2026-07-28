cmake_minimum_required(VERSION 3.20)
project(SmartBridge_Firmware C CXX ASM)

set(CMAKE_C_STANDARD 17)
set(CMAKE_C_STANDARD_REQUIRED ON)

add_definitions(-DSTM32F407xx -DUSE_HAL_DRIVER)

include_directories(
    Core/Inc
    Bootloader
)

file(GLOB_RECURSE SOURCES
    Core/Src/*.c
    Bootloader/*.c
)

add_executable(smartbridge_fw.elf ${SOURCES})

target_compile_options(smartbridge_fw.elf PRIVATE
    -Wall
    -Wextra
    -Wpedantic
    -O2
    -g
)
