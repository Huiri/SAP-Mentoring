sap.ui.define(
    [
        "sap/ui/core/mvc/Controller", "../model/formatter",
        "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator", "sap/ui/model/Sorter", "sap/ui/core/Fragment"
    ],
    function(Controller, formatter, Filter, FilterOperator, Sorter, Fragment) {
      "use strict";
  
      return Controller.extend("project1.controller.ResponsiveMaterial", {
        formatter : formatter,

        onInit() {
        },
        //검색을 위한 함수
        onSearch : function () {
            // sap.ui.controller("project1.controller.")
            let category = this.byId("category").getValue(); 
            let code = this.byId("code").getValue(); 
            let name = this.byId("name").getValue();
            let date = this.byId("date").getValue();
            let produce = this.byId("produce").getSelectedKey();

            console.log(date)
            if(date){
                let MYear = date.split(".")[0]; //". " 기준으로 잘라서 앞의 연도 값을 변수에 저장
                let MMonth = date.split(".")[1]; //". " 기준으로 잘라서 뒤의 일이 2자리가 아닐 경우 0을 붙여서 변수에 저장
                let MDay = date.split(".")[2]; //". " 기준으로 잘라서 뒤의 일이 2자리가 아닐 경우 0을 붙여서 변수에 저장
                
                date = MYear + "-" + MMonth+"-" + MDay; //형식을 맞추어주기 위해서 연도-일자 형식으로 ReqDate 값에 저장
                console.log(date)


            }

            var aFilter = []; // 여러 필터 값을 지정할 수 있도록 배열로 받기

            if(category) {aFilter.push(new Filter("category", FilterOperator.Contains, category))} //ReqNum값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
            if(code) {aFilter.push(new Filter("code", FilterOperator.Contains, code))} //ReqGood값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
            if(name) {aFilter.push(new Filter("name", FilterOperator.Contains, name))} //Requester값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
            if(date) {aFilter.push(new Filter("date", FilterOperator.Contains, date))} //ReqDate값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
            if(produce) {aFilter.push(new Filter("produce", FilterOperator.Contains, produce))} //ReqStatus값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
            
            let oTable = this.byId("ui_table").getBinding("items"); //ui_table이라는 id값을 가진 테이블에 존재하는 데이터를 oData에 할당
            oTable.filter(aFilter); // 테이블에 존재하는 데이터를 설정된 필터 조건으로 필터링

        },
    

        //input 초기화 위한 함수
        onReset : function () {
            this.byId("category").setValue(""); 
            this.byId("code").setValue(""); 
            this.byId("name").setValue(""); 
            this.byId("produce").setSelectedKey(""); 
            this.byId("date").setValue(""); 
            //input 값 초기화
            this.onSearch(); // this가 onSearch를 가리키도록 함
        },
        //정렬을 위한 함수
        onSort : function () {
            // load가 되어있다면 load를 시켜주고 실행, 아니라면 그냥 open
            // 한번 실행 이후 fragment 호출 처리를 위한 조건문
            if(!this.byId("SortDialog")){
                Fragment.load({
                    // 즉 프레그먼트 자체의 아이디가 아닌 현재 화면의 viewid를 받아서 뿌려주기 위함
                    id: this.getView().getId(), //어느 뷰에 fragment 띄울 것인지 결정
                    // (즉 현재 화면에 띄우기 위해 현재 페이지 view id 불러옴)
                    // id : application-project1-display-component---Request (npm으로 build 시)
                    // 특정값으로 지정하지 않을 시 계속 상속하기 때문에 id값을 지정해줌(즉 fragment를 가리킴)
                    name : "project1.view.fragment.SortMaterialDialog",
                    // 불러올 fragment가 존재하는 경로
                    controller : this
                    // this를 현재 함수가 아닌 전체 controller를 가리키게 함
                }).then(function(oDialog){ // 동기처리(load가 완료된 후에 실행)
                    this.getView().addDependent(oDialog);
                    // fragment는 생명주기와 model 존재 X. 뷰가 destory 될 때 자동으로 destory됨
                    // 자식요소 즉 fragment를 부모 요소 즉 view의 생명주기 이벤트와 모델을 상속시킴
                    // 로드했던 상태를 갖고 있으려고 view에 상속시킴
                    oDialog.open("filter");
                    // filter 필요 X, 삭제해도 정상적으로 작동
                    // 프레그먼트 파일 화면에 띄우기
                }.bind(this));//this가 함수 안의 this라 적용 X
                //해결방안
                //1) bind(this) : 컨트롤러를 가리키게 함
                //2) 애초에 조건문 바깥에 this를 가리키는 변수 선언 -> 함수 안에서도 컨트롤러 전체를 의미하는 this로 사용
            } else {
                this.byId("SortDialog").open("filter");//SortDialog라는 id값을 가진 화면에 띄우기(fragment dialog 띄우기)
                
            }
            console.log(this.onSearch());
            // this.onSearch();//화면에 보여주기 위함 -> 필요없다고 지우심

            },

            // 정렬 조건 선택 후 확인 버튼을 눌렀을 때 실행되는 함수
            onConfirmSortDialog : function(oEvent){ 
                let mParams = oEvent.getParameters(); //이벤트로 발생하는 파라미터, 즉 정렬 조건 받아 mParmas 변수에 저장
                let sPath = mParams.sortItem.getKey(); // 받은 파라미터의 키값 받기
                let bDescending = mParams.sortDescending; //오름차순, 내림차순 여부 설정을 받는 변수(true일 경우 내림차순 적용)

                let aSorters = []; // 정렬 조건들을 한번에 저장하기 위한 배열  선언(정렬 순서와 정렬 기준, 2개가 존재하기 때문)

                aSorters.push(new Sorter(sPath, bDescending)); // 배열에 정렬 조건(custom, 내림||오름차순)을 Sorter를 생성하여 push
                //bDescending 대신 true, false 직접 하드코딩해도 상관 X

                let oBinding = this.byId("ui_table").getBinding("items"); //ui_table이라는 id값을 가진 테이블에 존재하는 데이터를 oBinding에 할당
                oBinding.sort(aSorters); // 테이블에 존재하는 데이터를 설정된 정렬 조건 적용
            },
            toGridTable :function (){
                this.getOwnerComponent().getRouter().navTo("GridMaterial");
                //getOwnerComponent : manifest||Component에 있는 정보 불러올 때 사용하는 메소드
                //getRouter : Router의 정보를 가져오고자 할 때 사용하는 메소드
                //navTo : navigation To의 약자, routes의 name을 통해 이동

                //주소줄에 입력해서 이동하고 싶을 시 #/CreateOrder -> # :해시 기반으로 타겟 찾아오기 때문

            },
            onValueHelpRequest : function(){
                if(!this.byId("compop")){
                    Fragment.load({
                        id: this.getView().getId(), 
                        name : "project1.view.fragment.MaterialSearch",
                        controller : this
                    }).then(function(oDialog){ 
                        this.getView().addDependent(oDialog);
                        oDialog.open("filter");
                    }.bind(this));
                } else {
                    this.byId("compop").open("filter");
                }       
            },
            onCloseDialog : function() { // Busy Dialog
                this.byId("compop").close();
                //close일 경우 일회용
                //destroy로 변경 시 다회 사용 가능
                this.pDialog = null;
            },
            onSearchOpt : function() {
                let pop_mcode = this.byId("pop_mcode").getValue(); 
                let pop_mname = this.byId("pop_mname").getValue();

            
                var aFilter = []; // 여러 필터 값을 지정할 수 있도록 배열로 받기

                if(pop_mcode) {aFilter.push(new Filter("code", FilterOperator.Contains, pop_mcode))} //ReqGood값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환
                if(pop_mname) {aFilter.push(new Filter("name", FilterOperator.Contains, pop_mname))} //Requester값이 존재할 경우 해당하는 값이 존재할 때 결과값으로 반환

                let oTable = this.byId("selection_table").getBinding("rows");
                oTable.filter(aFilter); 


            },
            onSearchOptReset : function(){
                this.byId("pop_mcode").setValue(""); 
                this.byId("pop_mname").setValue(""); 
                //input 값 초기화
                this.onSearchOpt(); // this가 onSearch를 가리키도록 함
    
            },
            //원하는 row값 출력
            getContext : function(){
                var oTable = this.byId("selection_table");
                var iIndex = oTable.getSelectedIndex();
                var sMsg, row_value;
                if (iIndex < 0) {
                    sMsg = null;
                } else {
                    sMsg = oTable.getContextByIndex(iIndex);
                    var row_value = sMsg.sPath;
                }
            

                // this.byId("pop_mcode").setValue(this.getView().getModel("Material").getProperty(row_value)["code"]); 
                // this.byId("pop_mname").setValue(this.getView().getModel("Material").getProperty(row_value)["name"]); 
                this.byId("code").setValue(this.getView().getModel("Material").getProperty(row_value)["code"]); 
                this.byId("name").setValue(this.getView().getModel("Material").getProperty(row_value)["name"]); 
                this.onCloseDialog();
            },
        
      });
    }
  );