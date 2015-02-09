<?php
/**
 * File containing the PlatformUIController class.
 *
 * @copyright Copyright (C) eZ Systems AS. All rights reserved.
 * @license For full copyright and license information view LICENSE file distributed with this source code.
 */

namespace EzSystems\PlatformUIBundle\Controller;

use eZ\Bundle\EzPublishCoreBundle\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class PlatformUIController extends Controller
{
    /**
     * @var Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $session;

    /**
     * The configured anonymous user id
     *
     * @var int
     */
    private $anonymousUserId;

    public function __construct( SessionInterface $session, $anonymousUserId = 10 )
    {
        $this->session = $session;
        $this->anonymousUserId = $anonymousUserId;
    }

    /**
     * Renders the "shell" page to run the JavaScript application
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function shellAction()
    {
        $sessionInfo = array( 'isStarted' => false );
        if ( $this->session->isStarted() )
        {
            $sessionInfo['isStarted'] = true;
            $sessionInfo['name'] = $this->session->getName();
            $sessionInfo['identifier'] = $this->session->getId();
            $sessionInfo['href'] = $this->generateUrl(
                'ezpublish_rest_deleteSession',
                array( 'sessionId' => $this->session->getId() )
            );
        }
        return $this->render(
            'eZPlatformUIBundle:PlatformUI:shell.html.twig',
            array(
                'sessionInfo' => $sessionInfo,
                'anonymousUserId' => $this->generateUrl(
                    'ezpublish_rest_loadUser',
                    array( 'userId' => $this->anonymousUserId )
                ),
            )
        );
    }
}
