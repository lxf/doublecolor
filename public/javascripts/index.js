//获取院校信息
function getSchools(me) {
    var domstr = '';
    if (me == "local") {
        $('#form_select_schoolarea option').remove();
        _.each(allUnivList.provs, function (ele, index, list) {
            domstr += '<option>' + ele.name + '</option>';
        })
        $('#form_select_schoolarea').append(domstr);
    }
    else {
        var area = $(me).val();
        if (area != '' || area != undefined) {
            var par = {};
            par.name = area;
            $.ajax({
                type: "POST",
                url: '/college/getSchools',
                data: par,
                success: function (data, textStatus) {
                    $('#form_select_school option').remove();
                    _.each(data, function (ele, index, list) {
                        domstr += '<option>' + ele + '</option>';
                    })
                    $('#form_select_school').append(domstr);
                }
            });
        }
    }
}

//获取专业信息
function getMajors(me) {
    var school = $(me).val();
    if (school != '' || school != undefined) {
        getMajorOfSchool(school);
    }
}

function getMajorOfSchool(school) {
    var par = {};
    par.name = school;
    $.ajax({
        type: "POST",
        url: '/college/getMajors',
        data: par,
        success: function (data, textStatus) {
            $('#form_select_major option').remove();
            var domstr = '';
            _.each(data, function (ele, index, list) {
                domstr += '<option>' + ele + '</option>';
            })
            $('#form_select_major').append(domstr);
        }
    });
}
//获取入学年级
function getSchoolyears(me) {
    $('#form_select_schoolyear option').remove();
    var todayyear = (new Date()).getFullYear();
    var domstr = '';
    //年级
    for (var i = todayyear; i > todayyear - 10; i--) {
        domstr += '<option>' + i + '</option>';
    }
    $('#form_select_schoolyear').append(domstr);
}

function changeSchool(params) {
    var domstr = '';
    $('#form_select_school option').remove();
    _.each(allUnivList.provs, function (ele, index, list) {
        if (ele.name == params.value) {
            _.each(ele.univs, function (_ele, _index, _list) {
                domstr += '<option>' + _ele.name + '</option>';
                if (_index == 0) {
                    //获取专业
                    getMajorOfSchool(_ele.name);
                }
            })
        }
    });
    $('#form_select_school').append(domstr);

}