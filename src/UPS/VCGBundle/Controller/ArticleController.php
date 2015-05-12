<?php

namespace UPS\VCGBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Yaml\Parser;


class ArticleController extends Controller
{   
    /**
     * @Route("/article/{slug}")
     * @Route("/article/{slug}.html")
     */
    public function indexAction($slug)
    {
        if(substr($slug, -5, 5) === '.html') {
            $slug = substr($slug, 0, -5);
        }
        $yaml = new Parser();
        $article = array();

        try {
            $article = $yaml->parse(file_get_contents( dirname(dirname(__FILE__)). "/Resources/data/articles/$slug.yml"));
        } catch (ParseException $e) {
            printf("Unable to parse the YAML file: %s", $e->getMessage());
        }

        return $this->render(
            'VCGBundle:Layouts:article.html.twig',
            array('slug' => $slug, 'article' => $article)
        );
    }
}
