<?php

namespace UPS\VCGBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction()
    {   
        $title = "Home";
        return $this->render(
            'VCGBundle:Layouts:home.html.twig', array('title' => $title)
        );
    }
}
