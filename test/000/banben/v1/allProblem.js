测试问题：

   蓝牙方面：一台pad和两个仪器配对，如果有一个仪器先开机连上了，另一台再连接就连不上了，无论是否将已连上那台的关机。
   解决办法：只能是将已连接那台取消配对。才能连接另一台。


   消息问题 ：
   	  测试血氧饱和度时得出消息后服务有时候会停止运行（没有规律。具体不清楚原因。只返回结果，没有用户退出的消息）





   	  消息格式没有统一。type: 有时候有，有时候没有，有时候是空值。在用户退出时没有type的


     二氧化碳消息标识：等待回复平稳基线是处于什么情况。一次测试时吹气口拔掉后一直发出，接入后停止。有时候会没有数据而需要拔掉吹气口重新装上
     					但是并不是拔掉吹气口后一定会出现此类消息



状态对应：
		
		开始  
             {"0":"onBtnClick","1":"00000","2":"呼末二氧化碳APP","3":"window.AndroidCallBack"}

        连接设备 ：没有具体找到设备
             01：设备服务输出消息；02：{msg:'呼末二氧化碳<br/>正在连接设备',type:''}

        连接设备 ：找到并且开始连接
             01：设备服务输出消息；02：{msg:'呼末二氧化碳:<br/>[设备连接中...]',type:'呼末二氧化碳'}

         预热 ：
            01：设备服务输出消息；02：{msg:'呼末二氧化碳:<br/>[结果, 待命]',type:'呼末二氧化碳'}
            01：设备服务输出消息；02：{msg:'[当前co2, 待命 [178.90001, 256.9, 216.86005] 0.0 -1000.0]',type:'通用消息'}
            01：设备服务输出消息；02：{msg:'[结果, 待命]',type:'通用消息'}
            01：设备服务输出消息；02：{msg:'呼末二氧化碳:<br/>[请呼气...]',type:'呼末二氧化碳'}

            （有四条消息在此阶段发出）

         残留二氧化碳没有清理 ：
            01：设备服务输出消息；02：{msg:'[当前co2, 等待回复平稳基线 [25.610004, 0.0, 0.0] 0.0 -1000.0]',type:'通用消息'}


         开始检测
            01：设备服务输出消息；02：{msg:'呼末二氧化碳:<br/>[结果, 检查开始]',type:'呼末二氧化碳'}

         	01：设备服务输出消息；02：{msg:'呼末二氧化碳:<br/>[请缓慢呼气，尽量完全呼出]',type:'呼末二氧化碳'}

         获得结果（有时候没有该条消息）
            01：设备服务输出消息；02：{msg:'呼末二氧化碳:<br/>[获得结果, 34.95]',type:'呼末二氧化碳'}

            （两者可能出现其中一种）

            01：co2；02：{"code":"0","data":["co2","34.66"],"msg":"操作成功"}


         自行退出

         	01：{"code":"0","data":["呼末01：{"code":"0","data":["呼末二氧化碳","用户退出"],"msg":"用户退出"}

            01：{"code":"0","data":["呼末二氧化碳","用户退出"],"msg":"用户退出"}

            {"0":"exitMonitor"}