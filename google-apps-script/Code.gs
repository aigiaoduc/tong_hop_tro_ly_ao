function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action || 'getAll';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'getAll') {
      var reviews = getSheetReviews(ss);
      var apps = getSheetApps(ss, reviews);
      return responseJSON({
        success: true,
        data: {
          config: getSheetConfig(ss),
          apps: apps,
          videos: getSheetVideos(ss),
          ads: getSheetAds(ss),
          reviews: reviews
        }
      });
    }

    if (action === 'getConfig') {
      return responseJSON({ success: true, data: getSheetConfig(ss) });
    }
    if (action === 'getApps') {
      return responseJSON({ success: true, data: getSheetApps(ss, getSheetReviews(ss)) });
    }
    if (action === 'getVideos') {
      return responseJSON({ success: true, data: getSheetVideos(ss) });
    }
    if (action === 'getAds') {
      return responseJSON({ success: true, data: getSheetAds(ss) });
    }
    if (action === 'getReviews') {
      return responseJSON({ success: true, data: getSheetReviews(ss) });
    }

    return responseJSON({ success: false, message: 'Invalid action' });
  } catch (err) {
    return responseJSON({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  try {
    var contents = e.postData ? e.postData.contents : '';
    var payload = {};
    try {
      payload = JSON.parse(contents);
    } catch (err) {
      payload = e.parameter || {};
    }

    var action = payload.action || (e.parameter ? e.parameter.action : '');
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'trackView') {
      var appId = payload.id || payload.appId;
      if (!appId) return responseJSON({ success: false, message: 'Missing app id' });

      var sheet = ss.getSheetByName('Ứng dụng');
      if (!sheet) return responseJSON({ success: false, message: 'Sheet not found' });

      var values = sheet.getDataRange().getValues();
      var newViews = 0;
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][0]).trim() === String(appId).trim()) {
          newViews = (Number(values[i][8]) || 0) + 1;
          sheet.getRange(i + 1, 9).setValue(newViews);
          return responseJSON({ success: true, newViews: newViews });
        }
      }
      return responseJSON({ success: false, message: 'App not found' });
    }

    if (action === 'trackVideoView') {
      var vidId = payload.id || payload.vidId;
      if (!vidId) return responseJSON({ success: false, message: 'Missing video id' });

      var sheetVid = ss.getSheetByName('Video');
      if (!sheetVid) return responseJSON({ success: false, message: 'Sheet not found' });

      var vidValues = sheetVid.getDataRange().getValues();
      var newVidViews = 0;
      for (var v = 1; v < vidValues.length; v++) {
        if (String(vidValues[v][0]).trim() === String(vidId).trim()) {
          newVidViews = (Number(vidValues[v][5]) || 0) + 1;
          sheetVid.getRange(v + 1, 6).setValue(newVidViews);
          return responseJSON({ success: true, newViews: newVidViews });
        }
      }
      return responseJSON({ success: false, message: 'Video not found' });
    }

    if (action === 'submitFeedback') {
      var sheetFb = ss.getSheetByName('Phản hồi');
      if (!sheetFb) {
        sheetFb = ss.insertSheet('Phản hồi');
        sheetFb.appendRow(['Thời gian', 'Họ tên', 'Email', 'Nội dung']);
      }
      var now = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
      sheetFb.appendRow([now, payload.name || '', payload.email || '', payload.content || '']);
      return responseJSON({ success: true });
    }

    if (action === 'submitReview') {
      var sheetRev = ss.getSheetByName('Đánh giá') || ss.getSheetByName('Reviews');
      if (!sheetRev) {
        sheetRev = ss.insertSheet('Đánh giá');
        sheetRev.appendRow(['Thời gian', 'ID Ứng dụng', 'Tên Ứng dụng', 'Họ tên', 'Trường / Cấp học', 'Số sao', 'Nội dung', 'Trạng thái']);
      }
      var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
      var rAppId = String(payload.appId || '').trim();
      var rAppName = String(payload.appName || '').trim();
      var rName = String(payload.name || '').trim();
      var rSchool = String(payload.school || '').trim();
      var rRating = Number(payload.rating) || 5;
      var rComment = String(payload.comment || '').trim();
      var rStatus = 'Hiện';

      sheetRev.appendRow([nowStr, rAppId, rAppName, rName, rSchool, rRating, rComment, rStatus]);
      return responseJSON({ success: true, message: 'Đã gửi đánh giá thành công' });
    }

    return responseJSON({ success: false, message: 'Invalid post action' });
  } catch (err) {
    return responseJSON({ success: false, error: err.toString() });
  }
}

function getSheetConfig(ss) {
  var sheet = ss.getSheetByName('Cấu hình') || ss.getSheetByName('Config');
  var config = {};
  if (!sheet) return config;
  var rows = sheet.getDataRange().getValues();
  for (var i = 0; i < rows.length; i++) {
    if (rows[i][0]) {
      config[String(rows[i][0]).trim()] = rows[i][1] !== undefined && rows[i][1] !== null ? String(rows[i][1]).trim() : '';
    }
  }
  return config;
}

function getSheetReviews(ss) {
  var sheet = ss.getSheetByName('Đánh giá') || ss.getSheetByName('Reviews');
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  var reviews = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[1] && !r[3]) continue;

    var status = String(r[7] || 'Hiện').trim();
    if (status === 'Ẩn') continue;

    reviews.push({
      id: 'REV' + i,
      time: r[0] ? (r[0] instanceof Date ? Utilities.formatDate(r[0], 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy') : String(r[0])) : '',
      appId: String(r[1] || '').trim(),
      appName: String(r[2] || '').trim(),
      name: String(r[3] || '').trim(),
      school: String(r[4] || '').trim(),
      rating: Number(r[5]) || 5,
      comment: String(r[6] || '').trim(),
      status: status
    });
  }
  return reviews;
}

function getSheetApps(ss, existingReviews) {
  var sheet = ss.getSheetByName('Ứng dụng');
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  var apps = [];
  var classroomIds = ["UD14", "UD2", "UD8", "UD3", "UD7", "UD6", "UD13", "UD16", "UD9", "UD19"];
  var reviewsList = existingReviews || [];

  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0] && !r[1]) continue;

    var id = String(r[0] || '').trim();
    var name = String(r[1] || '').trim();
    var short_desc = String(r[2] || '').trim();
    var desc = String(r[3] || short_desc).trim();
    var link = String(r[4] || '').trim();
    var img = String(r[5] || '').trim();
    var mode = String(r[6] || 'EMBED').trim();
    var status = String(r[7] || 'Hiện').trim();
    var views = Number(r[8]) || 0;

    var category = 'teacher';
    var category_name = 'Công việc Giáo viên';
    var catVal = r[9] ? String(r[9]).trim().toLowerCase() : '';
    if (catVal.includes('lớp') || catVal.includes('học') || catVal.includes('trò chơi') || classroomIds.includes(id)) {
      category = 'classroom';
      category_name = 'Lớp học & Trò chơi';
    }

    var tags = [];
    if (r[10]) {
      tags = String(r[10]).split(',').map(function(t) { return t.trim(); }).filter(Boolean);
    }

    var appReviews = reviewsList.filter(function(rv) { return rv.appId === id; });
    var reviewCount = appReviews.length;
    var avgRating = 5.0;
    if (reviewCount > 0) {
      var totalScore = appReviews.reduce(function(acc, curr) { return acc + (curr.rating || 5); }, 0);
      avgRating = Number((totalScore / reviewCount).toFixed(1));
    }

    apps.push({
      id: id,
      name: name,
      short_desc: short_desc,
      desc: desc,
      link: link,
      img: img,
      mode: mode,
      status: status,
      views: views,
      category: category,
      category_name: category_name,
      tags: tags,
      rating: avgRating,
      reviewCount: reviewCount,
      badge: views > 2000 ? 'Hot' : (views < 500 ? 'Mới' : 'Phổ biến')
    });
  }
  return apps;
}

function getSheetVideos(ss) {
  var sheet = ss.getSheetByName('Video');
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  var videos = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0] && !r[1]) continue;

    var id = String(r[0] || '').trim();
    var title = String(r[1] || '').trim();
    var desc = String(r[2] || '').trim();
    var youtubeUrl = String(r[3] || '').trim();
    var status = String(r[4] || 'Hiện').trim();
    var views = Number(r[5]) || 0;

    var youtubeId = '';
    var match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      youtubeId = match[1];
    } else if (youtubeUrl.length === 11) {
      youtubeId = youtubeUrl;
    }

    videos.push({
      id: id,
      title: title,
      desc: desc,
      youtubeUrl: youtubeUrl,
      youtubeId: youtubeId,
      thumbnail: youtubeId ? 'https://img.youtube.com/vi/' + youtubeId + '/hqdefault.jpg' : '',
      status: status,
      views: views
    });
  }
  return videos;
}

function getSheetAds(ss) {
  var sheet = ss.getSheetByName('Quảng cáo');
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  var ads = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0] && !r[1] && !r[2]) continue;

    var id = String(r[0] || '').trim();
    var title = String(r[1] || '').trim();
    var content = String(r[2] || '').trim();
    var img = String(r[3] || '').trim();
    var attachment = String(r[4] || '').trim();
    var status = String(r[5] || 'Hiện').trim();

    ads.push({
      id: id,
      title: title,
      content: content,
      img: img,
      attachment: attachment,
      status: status
    });
  }
  return ads;
}
