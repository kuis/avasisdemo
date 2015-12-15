'use strict';

app.controller('SchedulesCtrl',
    ['$scope', '$state', '$uibModal', function($scope, $state, $uibModal) {
        $scope.pieOptions = {
            type: 'pie',
            height: '60px',
            offset: -90,
            sliceColors: ['#3aabd5', '#f1f1f1', '#f6b875'],
            disableTooltips: true
        };
        $scope.financialChartData = [
            {
                value: 32,
                color: "#79c485",
                text: "32%"
            },
            {
                value: 64,
                color: "#3aabd5",
                text: "64%"
            }
        ];
        $scope.calendarScope = 'week';
        $scope.today = moment('2015-08-17').startOf('day');
        $scope.weekTitles = [];
        $scope.daysInRange = [];
        $scope.offset = 0;
        $scope.schedulesInWeek = []; // schedules in date of range
        $scope.schedules = [{
            id: _.uniqueId(),
            description: "Roof Dry-In",
            start_date: moment('2015-08-17'),
            end_date: moment('2015-08-20'),
            schedule_type: "success",
            status: 'success',
            completion_percentage: 60
        },
        {
            id: _.uniqueId(),
            description: "Rough HVAC",
            start_date: moment('2015-08-17'),
            end_date: moment('2015-08-25'),
            schedule_type: "warning",
            status: "danger",
            completion_percentage: 40
        },
        {
            id: _.uniqueId(),
            description: "Rough Electrical",
            start_date: moment('2015-08-17'),
            end_date: moment('2015-08-18'),
            schedule_type: "primary",
            status: "success",
            completion_percentage: 90
        },
        {
            id: _.uniqueId(),
            description: "Framing",
            start_date: moment('2015-08-17'),
            end_date: moment('2015-08-17'),
            schedule_type: "danger",
            status: "success",
            completion_percentage: 100
        },
        {
            id: _.uniqueId(),
            description: "Plumbing",
            start_date: moment('2015-08-17'),
            end_date: moment('2015-09-01'),
            schedule_type: "primary",
            status: "success",
            completion_percentage: 20
        },
        {
            id: _.uniqueId(),
            description: "Landscaping",
            start_date: moment('2015-08-24'),
            end_date: moment('2015-09-04'),
            schedule_type: "success",
            status: "success",
            completion_percentage: 0
        },
        {
            id: _.uniqueId(),
            description: "Fire Sprinkler Rough-In",
            start_date: moment('2015-09-01'),
            end_date: moment('2015-09-04'),
            schedule_type: "success",
            status: "success",
            completion_percentage: 0
        }];
        _.each($scope.schedules, function(e) {
            e.days_of_period = e.end_date.diff(e.start_date, 'd') + 1;
        })

        $scope.range = function(val) {
            return _.range(val);
        }
        $scope.isEmptyDate = function(week, day) {
            var scheduled = _.filter($scope.schedulesInWeek[week], function(e) {
                return _.range(e.relativePos, e.relativePos + e.relativeLength).indexOf(day) >= 0;
            });
            return scheduled.length == 0;
        }

        function getWeekTitle(offset) {
            offset = $scope.offset + offset;
            if (offset == 0)
                return 'THIS WEEK';
            else if (offset == 1)
                return 'NEXT WEEK';
            else if (offset == -1)
                return 'PREV WEEK';
            else if (offset < 0)
                return -offset + ' WEEKS AGO';
            else
                return offset + ' WEEKS OUT';
        }
        function resetOffsetRange() {
            if ($scope.calendarScope == 'day') {
                $scope.startDate = moment('2015-08-16').startOf('day').add($scope.offset * 3, 'd');
                $scope.endDate = moment('2015-08-16').startOf('day').add($scope.offset * 3 + 2, 'd');
            }
            else if ($scope.calendarScope == 'week') {
                $scope.startDate = moment('2015-08-16').startOf('week').add($scope.offset, 'w');
                $scope.endDate = moment('2015-08-16').startOf('week').add($scope.offset + 2, 'w').endOf('week');

                $scope.weekTitles = [];
                _.each([0, 1, 2], function(i){ $scope.weekTitles.push(getWeekTitle(i)); });
                
                $scope.daysInRange = [];
                var startDate;
                for (var i = 0; i < 21; i ++) {
                    startDate = angular.copy($scope.startDate);
                    $scope.daysInRange.push(startDate.add(i, 'd').format('ddd, MMM DD'));
                }

                // filter schdules which are in date of range
                // repeat 3 times to filter schedules for 3 week
                _.times(3, function(i) {
                    var filteredInWeek = _.filter($scope.schedules, function(e) {
                        var startDate = moment($scope.startDate).add(i, 'w');
                        var endDate = moment(startDate).add(6, 'd');
                        return (startDate <= e.end_date) && (endDate >= e.start_date);
                    });
                    $scope.schedulesInWeek[i] = (angular.copy(filteredInWeek));

                    _.each($scope.schedulesInWeek[i], function(e) {
                        var startDate = moment($scope.startDate).add(i, 'w');
                        var relativePos = e.start_date.diff(startDate, 'd');
                        e.relativePos = Math.max(relativePos, 0);

                        // calculate relative length
                        e.relativeLength = Math.min(e.days_of_period + relativePos, 7) - e.relativePos;
                    });
                });
            }
        }

        $scope.plusOffset = function() {
            $scope.offset = $scope.offset + 3;
            resetOffsetRange();
        }
        $scope.minusOffset = function() {
            $scope.offset = $scope.offset - 3;
            resetOffsetRange();
        }
        $scope.getOffsetDate = function(offset) {
            var offseDate = $scope.startDate.add(offset, 'd').format('ddd, MMM DD')
            return offseDate;
        }
        $scope.changeCalendarScope = function(scope) {
            $scope.calendarScope = scope;
            $scope.offset = 0;
            resetOffsetRange();
        }
        $scope.showScheduleDetail = function(id) {
            $state.go("schedules.detail", {id: id});
        }
        resetOffsetRange();
    }]
);