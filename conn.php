<?php

header("Content-Type: text/html;charset=utf-8");
//error_reporting(E_ALL^E_NOTICE^E_WARNING);
$conn =mysqli_connect("localhost","root","");
if(!$conn){ echo "失败"; };

$StartingLine=$_GET['StartingLine'];//查询第几行的数据
$rowsNumber=$_GET['rowsNumber'];//一次查询多少行
mysqli_query($conn ,'set names utf8');

//第StartLine行开始，后rowsNumber条数据
$cont = "select * from info order by id DESC limit ".$StartingLine.",".$rowsNumber;
mysqli_select_db($conn,"lyb");
$result = mysqli_query($conn,$cont);
$arr=[];
while ($row = mysqli_fetch_array($result,MYSQL_ASSOC)){
    $row1 = JSON($row);
    array_push($arr,$row1);
}

 echo arrayToJson($arr);
// 将json数组串成标准化的
// {}{}{}{} => {},{},{}
function arrayToJson($temp1){
    $str = "";
    for($i=0;$i<count($temp1);$i++){
        $str.= $temp1[$i];
        if($i<count($temp1)-1)
        { $str.="*^^^^^^^^^^*";}
    }
    return $str;
}


//把字符串中中文乱码转码
function arrayRecursive(&$array, $function, $apply_to_keys_also = false)
{
    static $recursive_counter = 0;
    if (++$recursive_counter > 1000) {
        die('possible deep recursion attack');
    }
    foreach ($array as $key => $value) {
        if (is_array($value)) {
            arrayRecursive($array[$key], $function, $apply_to_keys_also);
        } else {
            $array[$key] = $function($value);
        }

        if ($apply_to_keys_also && is_string($key)) {
            $new_key = $function($key);
            if ($new_key != $key) {
                $array[$new_key] = $array[$key];
                unset($array[$key]);
            }
        }
    }
    $recursive_counter--;
}

function JSON($array) {
	arrayRecursive($array, 'urlencode', true);
	$json = json_encode($array);
	return urldecode($json);
}

?>
