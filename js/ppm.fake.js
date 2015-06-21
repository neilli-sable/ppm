/*
 * ppm.fake.js
 * PleasePleaseMeのフェイクデータ
*/
ppm.fake = (function() {
  'use strict';
  var getTaskList;

  getTaskList = function() {
    return [
      {
        id: '0000000001',
        title: '次の休みどこいくか考えておいて',
        content: '日曜日休みだから、何処か行きましょう。'
      },
      {
        id: '0000000002',
        title: 'ホームページに新しい写真を載せて',
        content: '可愛い犬の写真送っておいたよ。'
      },
      {
        id: '0000000003',
        title: 'お買い物すること',
        content: 'だいこん、ほうれんそう、やきそば。'
      }
    ];
  };

  return {
    getTaskList: getTaskList
  };
}());
