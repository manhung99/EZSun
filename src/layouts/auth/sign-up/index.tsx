import React from 'react';
import { View } from 'react-native';
import {
  Button,
  CheckBox,
  Datepicker,
  Divider,
  Input,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import { ImageOverlay } from './extra/image-overlay.component';
import {
  ArrowForwardIconOutline,
  FacebookIcon,
  GoogleIcon,
  HeartIconFill,
  TwitterIcon,
} from './extra/icons';
import { KeyboardAvoidingView } from './extra/3rd-party';
import { firebase, getSnapshotFromUserAuth } from '../../../firebase/config';
import { useAppState } from '../../../store/appState';
import { AppActionType } from '../../../reducers/appReducer';

const isValidEmail = (email: string) => {
  const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(String(email).toLowerCase());
};

export default ({ navigation }): React.ReactElement => {

  const [fullName, setFullName] = React.useState<string>();
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [passwordConfirmation, setPasswordConfirmation] = React.useState<string>();
  const { dispatch } = useAppState();
  const styles = useStyleSheet(themedStyles);

  const onSignUpButtonPress = async (): Promise<void> => {
    // navigation && navigation.goBack();
    if (!password || !email || !fullName) {
      alert('All fields are required.');
      return;
    }

    if (!isValidEmail(email)) {
      alert('Invalid email!');
      return;
    }

    if (password !== passwordConfirmation) {
      alert('Passwords don\'t match.');
      return;
    }

    try {
      const userData = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const userSnapshot = await getSnapshotFromUserAuth(userData.user, {}, true);

      if (userSnapshot) {
        dispatch({ type: AppActionType.AUTH_CHANGE, auth: { id: userSnapshot.id, ...userSnapshot.data() } });
      }

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        alert('That email address is invalid!!');
      }
      console.error('Error signing up', error);
    }

  };

  const onSignInButtonPress = (): void => {
    navigation && navigation.navigate('SignInScreen');
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ImageOverlay
        style={styles.headerContainer}
        source={require('./assets/image-background.jpg')}>
        <Button
          style={styles.evaButton}
          appearance='ghost'
          status='control'
          size='large'
          icon={HeartIconFill}>
          EVA
        </Button>
        <View style={styles.signUpContainer}>
          <Text
            style={styles.signInLabel}
            category='h4'
            status='control'>
            SIGN UP
          </Text>
          <Button
            style={styles.signInButton}
            appearance='ghost'
            status='control'
            size='giant'
            icon={ArrowForwardIconOutline}
            onPress={onSignInButtonPress}>
            Sign In
          </Button>
        </View>
      </ImageOverlay>
      <View style={styles.socialAuthContainer}>
        <Text style={styles.socialAuthHintText}>
          Sign with a social account
        </Text>
        <View style={styles.socialAuthButtonsContainer}>
          <Button
            appearance='ghost'
            size='giant'
            status='basic'
            icon={GoogleIcon}
          />
          <Button
            appearance='ghost'
            size='giant'
            status='basic'
            icon={FacebookIcon}
          />
          <Button
            appearance='ghost'
            size='giant'
            status='basic'
            icon={TwitterIcon}
          />
        </View>
      </View>
      <View style={styles.orContainer}>
        <Divider style={styles.divider}/>
        <Text
          style={styles.orLabel}
          category='h5'>
          OR
        </Text>
        <Divider style={styles.divider}/>
      </View>
      <Text
        style={styles.emailSignLabel}>
        Sign up with Email
      </Text>
      <View style={[styles.container, styles.formContainer]}>
        <Input
          placeholder='Name'
          label='FULL NAME'
          autoCapitalize='words'
          value={fullName}
          onChangeText={setFullName}
        />
        <Input
          style={styles.formInput}
          placeholder='example@gmail.com'
          label='EMAIL'
          autoCapitalize='none'
          value={email}
          onChangeText={setEmail}
        />
        <Input
          style={styles.formInput}
          label='PASSWORD'
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
        />
        <Input
          style={styles.formInput}
          label='PASSWORD CONFIRMATION'
          placeholder='Password confirmation'
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
        />
      </View>
      <Button
        style={styles.signUpButton}
        size='large'
        onPress={onSignUpButtonPress}>
        SIGN UP
      </Button>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'background-basic-color-1',
  },
  headerContainer: {
    minHeight: 216,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 44,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
  },
  socialAuthContainer: {
    marginTop: 24,
  },
  socialAuthButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  socialAuthHintText: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  formContainer: {
    marginTop: 48,
    paddingHorizontal: 16,
  },
  evaButton: {
    maxWidth: 72,
    paddingHorizontal: 0,
  },
  signInLabel: {
    flex: 1,
  },
  signInButton: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 0,
  },
  signUpButton: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  socialAuthIcon: {
    tintColor: 'text-basic-color',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 52,
  },
  divider: {
    flex: 1,
  },
  orLabel: {
    marginHorizontal: 8,
  },
  emailSignLabel: {
    alignSelf: 'center',
    marginTop: 8,
  },
  formInput: {
    marginTop: 16,
  },
  termsCheckBox: {
    marginTop: 20,
  },
  termsCheckBoxText: {
    fontSize: 11,
    lineHeight: 14,
    color: 'text-hint-color',
  },
});
