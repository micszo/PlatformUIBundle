<?php

/**
 * File containing the Authentication Functions for context class PlatformUI.
 *
 * @copyright Copyright (C) eZ Systems AS. All rights reserved.
 * @license For full copyright and license information view LICENSE file distributed with this source code.
 * @version //autogentag//
 */
namespace EzSystems\PlatformUIBundle\Features\Context\SubContext;

trait Authentication
{
    /**
     * Control variable to check if logged in.
     *
     * @var bool
     */
    protected $shouldBeLoggedIn;

    /**
     * @Given I go to homepage
     */
    public function goToPlatformUi($url = '')
    {
        $this->visit($this->platformUiUri . $url);
    }

    /**
     * @Given I go to PlatformUI app with username :user and password :password
     */
    public function goToPlatformUiAndLogIn($username, $password)
    {
        $this->goToPlatformUi();
        $this->waitWhileLoading();
        $this->fillFieldWithValue('username', $username);
        $this->fillFieldWithValue('password', $password);
        $this->iClickAtButton('Login');
        $this->iShouldBeLoggedIn();
    }

    /**
     * @Given I am logged in as admin on PlatformUI
     */
    public function loggedAsUserPlatformUi()
    {
        $this->goToPlatformUiAndLogIn($this->user, $this->password);
    }

    /**
     * @Given I am logged in as an :role in PlatformUI
     */
    public function loggedAsRolePlatformUI($role)
    {
        $credentials = $this->getCredentialsFor($role);
        $this->goToPlatformUiAndLogIn($credentials['login'], $credentials['password']);
    }

    /**
     * @Given I logout
     */
    public function iLogout()
    {
        $this->shouldBeLoggedIn = false;
        $this->goToPlatformUi('#/dashboard');

        $this->spin(
            function () {
                $userProfile = $this->findWithWait('.ez-user-profile');

                return $userProfile != null;
            }
        );

        $this->findWithWait('.ez-user-profile')->click();

        $this->spin(
            function () {
                $userMenu = $this->findWithWait('.ez-user-menu-item-notifications');

                return $userMenu != null;
            }
        );

        $this->iClickAtLink('Logout');
    }

    /**
     * @Then I should be logged in
     */
    public function iShouldBeLoggedIn()
    {
        $this->spin(
            function () {
                $logoutElement = $this->findWithWait('.ez-user-profile');

                return $logoutElement != null;
            }
        );
    }
}
