angular.module('dashCtrl',[])

    .controller('dashCtrl',['$scope','$http', 'checkoutService', function($scope,$http,checkoutService){

        var vm = this;
        vm.fields = [
            {label: 'Project Title', key: 'project'},
            {label: 'Description', key: 'description'},
            {label: 'File name', key: 'filename'},
            {label: 'Process', key: 'process'},
            {label: 'Material', key: 'material'},
            {label: 'Cost', key: 'cost'},
            {label: 'Email', key: 'email'}
              
        ];

        vm.record = {};
        vm.records = [];
        console.log('record details:');
        console.log(vm.record);
        
        $scope.branches = [
          { id: 'FDM', name: 'FDM'},
          { id: 'SLS', name: 'SLS'},
          { id: 'SLA', name: 'SLA'},
          { id: 'FDM', name: 'Don\'t know'}
        ];

        $scope.locations = [
            { id: 'PLA', branchId: 'FDM', name: 'PLA'},
            { id: 'ABS', branchId: 'FDM', name: 'ABS'},
            { id: 'PA 2200', branchId: 'SLS', name: 'PA 2200'},
            { id: 'Nylon 12', branchId: 'SLS', name: 'Nylon 12'},
            { id: 'Visijet', branchId: 'SLA', name: 'Visijet'},
            { id: 'Accura 25', branchId: 'SLA', name: 'Accura 25'},
            { id: 'Accura 60', branchId: 'SLA', name: 'Accura 60'}
        ];

        $(document).ready(function() {
    
            var navListItems = $('ul.setup-panel li a'),
                allWells = $('.setup-content');

            allWells.hide();

            navListItems.click(function(e)
            {
                e.preventDefault();
                var $target = $($(this).attr('href')),
                    $item = $(this).closest('li');
                
                if (!$item.hasClass('disabled')) {
                    navListItems.closest('li').removeClass('active');
                    $item.addClass('active');
                    allWells.hide();
                    $target.show();
                }
            });
            
            $('ul.setup-panel li.active a').trigger('click');
            
            // DEMO ONLY //
            $('#activate-step-2').on('click', function(e) {
                $('ul.setup-panel li:eq(1)').removeClass('disabled');
                $('ul.setup-panel li a[href="#step-2"]').trigger('click');
                $(this).remove();
            })    
        });

        $scope.loadLocations = function(branchId) {
          console.log('Selected BranchId: ' + branchId);
          vm.record.process= branchId; 
        }

        $scope.loadMaterial = function(material) {
            console.log('Selected material: ' + material);
            vm.record.material= material; 
        }

        $scope.filesChanged=function(elm){
            $scope.files=elm.files
            $scope.$apply();
        }

        $scope.upload = function(){
            var fd= new FormData()
            angular.forEach($scope.files, function(file){
                fd.append('file',file)
            })
            $http.post('api/upload',fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}

            })
            .success(function(d){
                console.log(d);
            })
        }

        vm.handleError = function(response) {
            console.log(response.status + " - " + response.statusText + " - " + response.data);
        }

        vm.getAllRecords = function() {
            $http.post('api/me').then(function(data){
                vm.record.email=data.data.username;
                var data=vm.record.email;
                console.log(data);
                $http.get('/api/records', {params: {name: data}}).then(function(response){
                    vm.records = response.data;
                }, function(response){
                    vm.handleError(response);
                });
            })
        }

        vm.quote=function(data){
            $http.post('api/quote/'+data).then(function(response){
                console.log(response.data);
                vm.getAllRecords();
            })

        }

        vm.getAllRecords();

        vm.editMode = false;
        
        vm.saveRecord = function() {
            console.log(vm.record);
            if(vm.editMode) {
                vm.updateRecord();
            } else {
                vm.addRecord();
            }
        }

        vm.addRecord = function() {
            console.log(vm.record);
            $http.post('/api/records', vm.record).then(function(response){
                console.log(response);
                vm.record = {};
                vm.getAllRecords();           
            }, function(response){
                vm.handleError(response);
            });
        }

        vm.updateRecord = function() {
            $http.put('/api/records/' + vm.record._id, vm.record).then(function(response){
                vm.record = {};
                vm.getAllRecords();
                vm.editMode = false;
            }, function(response){
                vm.handleError(response);
            });
        }

        vm.editRecord = function(record) {
            vm.record = record;
            vm.editMode = true;
        }

        vm.deleteRecord = function(recordid) {
            $http.delete('/api/records/'+recordid).then(function(response){
                console.log("Deleted");
                vm.getAllRecords();
            }, function(response){
                vm.handleError(response);
            })
        }

        vm.cancelEdit = function() {
            vm.editMode = false;
            m.record = {};
            vm.getAllRecords();
        }

        vm.checkout = function(recordid) {
            console.log(recordid);
            $http.post('api/checkout/'+recordid).then(function(response){
                console.log('IN dashCtrl');
                console.log(response.data);
                $scope.checkdata = [

                ];

                //var recordss=response.data;
                
                //checkoutService.setdata(response.data);
            })


        }

      
    }

])