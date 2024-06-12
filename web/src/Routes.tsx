import { PrivateSet, Route, Router, Set } from '@redwoodjs/router'

import BlogLayout from 'src/layouts/BlogLayout/BlogLayout'
import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <PrivateSet unauthenticated="login" roles="admin">
        <Set wrap={ScaffoldLayout} title="Posts" titleTo="posts" buttonLabel="New Post" buttonTo="newPost">
          <Route path="/admin/posts/new" page={PostNewPostPage} name="newPost" prerender />
          <Route path="/admin/posts/{id:Int!}/edit" page={PostEditPostPage} name="editPost" />
          <Route path="/admin/posts/{id:Int!}" page={PostPostsPage} name="post" />
          <Route path="/admin/posts" page={PostPostsPage} name="posts" />
        </Set>
      </PrivateSet>

      <Set wrap={BlogLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/about" page={AboutPage} name="about" prerender />
        <Route path="/contact" page={ContactPage} name="contact" prerender />
        <Route path="/article/{slug:String!}" page={ArticlePage} name="article" />
        <Route path="/chat/{chatRoomId:String!}" page={ChatPage} name="chat" />

        <Set prerender>
          <Route path="/login" page={LoginPage} name="login" />
          <Route path="/signup" page={SignupPage} name="signup" />
          <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
          <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
        </Set>
      </Set>

      <Route notfound page={NotFoundPage} prerender />
    </Router>
  )
}

export default Routes
