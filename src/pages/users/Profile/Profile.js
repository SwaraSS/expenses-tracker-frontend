import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userProfileAction } from "../../../redux/slices/users/userSlices";
import { useNavigate } from "react-router-dom";
import calTransaction from "../../../utils/accStatistics";
import DataGraph from "../../../components/Dashboard/DataGrap";
import UserProfileStats from "./UserProfileStats";
//import useDateFormatter from "../../../hooks/useDateFormatter";
import LoadingComponent from "../../../components/Loading/Loading";
import ErrorDisplayMessage from "../../../components/ErrorDisplayMessage";

const Profile = () => {
  const [expResult, setExpResult] = useState([]);
  const [incResult, setIncResult] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userProfileAction());
  }, [dispatch]);
  //history
  const nav = useNavigate();
  const users = useSelector(state => state?.users);
  const { profile, userLoading, userAppErr, userServerErr, userAuth } = users;

  // //income
  useEffect(() => {
    if (profile?.expenses) {
       const expenses =profile?.expenses && calTransaction(profile?.expenses);
       setExpResult(expenses);
     }
     if (profile?.income) {
       const income =profile?.income && calTransaction(profile?.income);
       setIncResult(income);
     }
   }, [profile?.income, profile?.expenses]);

  // console.log(results);
  const income = profile?.income;
  const totalInc = income
    ?.map(inc => inc?.amount)
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
    //console.log(totalIncome);

  //Total Expenses
  const expenses = profile?.expenses;
  const totalExp = expenses
    ?.map(inc => inc?.amount)
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
    //console.log(totalExp);

  // //Average expenses
  // const averageExp = totalExp / 2;

  // //min Expense

  // const expensesArr = profile?.expenses?.map(exp => exp?.amount);
  // const minExpenses = Math.min(...expensesArr);
  // const maxExpenses = Math.max(...expensesArr);

  // console.log(maxExpenses, totalExp);

  return (
    <>
      {userLoading ? (
        <LoadingComponent />
      ) : userAppErr || userServerErr ? (
        <>
          <ErrorDisplayMessage>
            {userServerErr} {userAppErr}
          </ErrorDisplayMessage>
        </>
      ) : (
        <section className="py-5">
          <div className="container">
            <div className="position-relative p-8 border rounded-2">
              <div className="d-flex mb-6 align-items-center">
                <img
                  className="img-fluid me-4 rounded-2"
                  //   style="width: 64px; height: 64px;"
                  //src="https://images.unsplash.com/photo-1593789382576-54f489574d26?ixlib=rb-1.2.1&amp;q=80&amp;fm=jpg&amp;crop=faces&amp;cs=tinysrgb&amp;fit=crop&amp;h=128&amp;w=128"
                  alt=""
                />
                <div>
                  <h6 className="fw-bold mb-0">
                    <span>
                      {profile?.firstname} {profile?.lastname}
                    </span>
                    <span className="badge ms-2 bg-primary-light text-primary">
                      {profile?.expenses?.length + profile?.income?.length}{" "}
                      Records Created
                    </span>
                  </h6>
                  <p className="mb-0">{profile?.email}</p>
                  <p className="mb-0">Date Joined: 12-Jan-1999</p>
                  <button
                    onClick={() => nav("/update-profile",{state:{user: userAuth}})}
                    className="btn"
                  >
                    Edit Profile
                    <i class="bi bi-pen fs-3 m-3 text-primary"></i>
                  </button>
                </div>
                <DataGraph
                  income={incResult?.sumTotal}
                  expenses={expResult?.sumTotal}
                />
              </div>

              <p className="mb-8"> </p>

              <UserProfileStats
                numOfTransExp={profile?.expenses?.length}
                avgExp={expResult?.avg}
                totalExp={expResult?.sumTotal}
                minExp={expResult?.min}
                maxExp={expResult?.max}
                numOfTransInc={profile?.income?.length}
                avgInc={incResult?.avg}
                totalInc={incResult?.sumTotal}
                minInc={incResult?.min}
                maxInc={incResult?.max}
              />
              <div className="d-flex align-items-center justify-content-center">
                <button
                  onClick={() => nav("/user-expenses")}
                  className="btn me-4 w-100 btn-danger d-flex align-items-center justify-content-center"
                >
                  <span>View Expenses History</span>
                </button>
                <button
                  onClick={() => nav("/user-income")}
                  className="btn w-100 btn-outline-success d-flex align-items-center justify-content-center"
                >
                  <span>View Income History</span>
                </button>
              </div>
            </div>
          </div>
        </section>
       )} 
    </>
  );
};

export default Profile;