import fs from "fs"
const {data} = JSON.parse(fs.readFileSync(process.argv[2],"utf-8"))
//console.log(data)

const result = Object.groupBy(data.authLog, ( { ip } ) => ip);
//console.log(result)

let allAverage = 0;
let allMinimum = 0;
let allMax = 0;
let countAve = 0;
let countMin = 0;
let countMax = 0;

//console.log("JSON")
//console.log(JSON.stringify(result));
// Levenshtein距離を計算する関数
    function levenshtein(str1, str2) {
      // console.log(`Levenshtein距離計算: ${str1} と ${str2}`); // 計算前にログを出力
       const len1 = str1.length;
       const len2 = str2.length;
       const dp = Array.from(Array(len1 + 1), () => Array(len2 + 1).fill(0));  //配列の作成

       //インデックスの作成
       for (let i = 0; i <= len1; i++) dp[i][0] = i;
       for (let j = 0; j <= len2; j++) dp[0][j] = j;

       for (let i = 1; i <= len1; i++) {
           for (let j = 1; j <= len2; j++) {
               if (str1[i - 1] === str2[j - 1]) {
                   dp[i][j] = dp[i - 1][j - 1];
               } else {
                   dp[i][j] = Math.min(
                       dp[i - 1][j] + 1,    // 削除
                       dp[i][j - 1] + 1,    // 挿入
                       dp[i - 1][j - 1] + 1 // 置換
                   );
               }
           }
       }
       const distance = dp[len1][len2];
     //  console.log(`Levenshtein距離: ${distance}`);  // 計算結果をログに出力
       
       const maxLength = Math.max(len1, len2); //長い文字数を採用
       const similarity = ((maxLength - distance) / maxLength) *100; //類似度
     //  console.log(`類似度%: ${similarity}`);
    //   return similarity.toFixed(2);  //小数点以下2桁で表示
       return similarity;
    }



 for(const [ip, users] of Object.entries(result)){
         const passwords = users.map(user => user.password)
         console.log(passwords)

         if(passwords.length != 1){
	 console.log(ip);
         let levenResult = [];
         for(let i=0; i+1<passwords.length; i++){
             levenResult [i] = levenshtein(passwords[i],passwords[i+1]);
 
         }
         console.log(`類似度の配列: ${levenResult}`);
 
         let average=0;
         let minimum;
         let max;
         
         //平均値の出力
         for(let i=0; i<levenResult.length; i++){
             console.log(levenResult[i]);

             average = average + levenResult [i] ;
         }
 
         //最大値の出力
         //for(let i=0; i<levenResult.length; i++){
         //    console.log(levenResult[i]);
         //       if(minimum != 0 && minimum > levenResult [i]){
         //               minimum = levenResult[i]

        //        }
        // }

         minimum=Math.min(levenResult)
 
 
         //最小値の出力
        // for(let i=0; i<levenResult.length; i++){
        //     console.log(levenResult[i]);
        //        if(max != 100 && max < levenResult [i]){
        //                max = levenResult[i]
        //        }
	// }
        max=Math.max(levenResult) 
	 
 
 
 
 
         average = average /levenResult.length;
         console.log(average);       //1回のみ入力は配列ないからNanと表示される
         console.log(minimum);
         console.log(max);
         //類似度0，100を除外したほうがよい？

         
         allAverage=allAverage + average;
         countAve = countAve + 1;
 
         allMinimum=allMinimum + minimum;
         countMin = countMin + 1;

         allMax = allMax + max;
         countMax = countMax + 1;

         }
}
     console.log(allAverage);
     console.log(countAve);
console.log(allMinimum);
console.log(countMin)
     allAverage=allAverage/countAve;
     allMinimum=allMinimum/countMin;
     allMax=allMax/countMax;

     console.log(`平均値：${allAverage}`)
     console.log(`最小値：${allMinimum}`)
     console.log(`最大値：${allMax}`)
