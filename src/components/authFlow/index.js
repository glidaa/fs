import React, { useState, useEffect } from 'react';
import styledComponents from "styled-components"
import { Redirect } from "react-router-dom"
import { connect } from "react-redux"
import { Auth } from "aws-amplify";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import TasksIllustartion from "../../assets/oleg-chursin-vaPoJZB9Mzg-unsplash.jpg"
import Login from './Login';
import NewAccount from './NewAccount';
import ForgotPassword from './ForgotPassword';

const AuthFlow = (props) => {
  const { route, dispatch } = props
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [referrer, setReferrer] = useState(null)
  const [currPage, setCurrPage] = useState(Login)
  useEffect(() => {
    setReferrer(props.route.location.state?.referrer)
    Auth.currentUserInfo().then((authData) => {
      if (authData) {
        //dispatch(appActions.setLoading(true))
        //setShouldRedirect(true)
      }
    })
  }, [])
  useEffect(() => {
    switch (route.match?.path) {
      case "/login":
        setCurrPage(Login)
        break
      case "/signup":
        setCurrPage(NewAccount)
        break
      case "/forgot-password":
        setCurrPage(ForgotPassword)
        break
      default:
        break
    }
  }, [route])
  return (
    <>
      {shouldRedirect ? (
        <Redirect to={referrer || "/"} />
      ) : (
        <AuthFlowContainer>
          {React.createElement(currPage, {setShouldRedirect, setCurrPage})}
        </AuthFlowContainer>
      )}
    </>
  )
}

const AuthFlowContainer = styledComponents(SimpleBar)`
  position: fixed;
  width: 100%;
  height: 100%;
  background: url(${TasksIllustartion});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  & .simplebar-content {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
  }
`

export default connect()(AuthFlow);